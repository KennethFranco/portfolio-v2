"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEntities = createEntities;
exports.createEntries = createEntries;
exports.createLocales = createLocales;
var _collection = require("lodash/collection");
var _object = require("lodash/object");
var _getEntityName = _interopRequireDefault(require("contentful-batch-libs/dist/get-entity-name"));
var _logging = require("contentful-batch-libs/dist/logging");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Creates a list of entities
 * Applies to all entities except Entries, as the CMA API for those is slightly different
 * See handleCreationErrors for details on what errors reject the promise or not.
 */
function createEntities({
  context,
  entities,
  destinationEntitiesById,
  requestQueue
}) {
  return createEntitiesWithConcurrency({
    context,
    entities,
    destinationEntitiesById,
    requestQueue
  });
}

// TODO
// Locales need to be created in series
function createLocales({
  context,
  entities,
  destinationEntitiesById,
  requestQueue
}) {
  return createEntitiesInSequence({
    context,
    entities,
    destinationEntitiesById,
    requestQueue
  });
}
async function createEntitiesWithConcurrency({
  context,
  entities,
  destinationEntitiesById,
  requestQueue
}) {
  const pendingCreatedEntities = entities.map(entity => {
    const destinationEntity = getDestinationEntityForSourceEntity(destinationEntitiesById, entity.transformed);
    const operation = destinationEntity ? 'update' : 'create';
    return requestQueue.add(async () => {
      try {
        const createdEntity = await (destinationEntity ? updateDestinationWithSourceData(destinationEntity, entity.transformed) : createInDestination(context, entity.transformed));
        creationSuccessNotifier(operation, createdEntity);
        return createdEntity;
      } catch (err) {
        return handleCreationErrors(entity, err);
      }
    });
  });
  const createdEntities = await Promise.all(pendingCreatedEntities);

  // Filter null values in case of errors
  return createdEntities.filter(entity => entity);
}
async function createEntitiesInSequence({
  context,
  entities,
  destinationEntitiesById,
  requestQueue
}) {
  const createdEntities = [];
  for (const entity of entities) {
    const destinationEntity = getDestinationEntityForSourceEntity(destinationEntitiesById, entity.transformed);
    const operation = destinationEntity ? 'update' : 'create';
    try {
      // Even though we run things in sequence here,
      // we still want to go through the normal rate limiting queue
      const createdEntity = await requestQueue.add(async () => {
        const createdOrUpdatedEntity = await (destinationEntity ? updateDestinationWithSourceData(destinationEntity, entity.transformed) : createInDestination(context, entity.transformed));
        return createdOrUpdatedEntity;
      });
      creationSuccessNotifier(operation, createdEntity);
      createdEntities.push(createdEntity);
    } catch (err) {
      const maybeSubstituteEntity = handleCreationErrors(entity, err);
      if (maybeSubstituteEntity) {
        createdEntities.push(maybeSubstituteEntity);
      }
    }
  }
  return createdEntities;
}

/**
 * Creates a list of entries
 */
async function createEntries({
  context,
  entities,
  destinationEntitiesById,
  requestQueue
}) {
  const createdEntries = await Promise.all(entities.map(entry => {
    return createEntry({
      entry,
      target: context.target,
      skipContentModel: context.skipContentModel,
      destinationEntitiesById,
      requestQueue
    });
  }));
  return createdEntries.filter(entry => entry);
}
async function createEntry({
  entry,
  target,
  skipContentModel,
  destinationEntitiesById,
  requestQueue
}) {
  const contentTypeId = entry.original.sys.contentType.sys.id;
  const destinationEntry = getDestinationEntityForSourceEntity(destinationEntitiesById, entry.transformed);
  const operation = destinationEntry ? 'update' : 'create';
  try {
    const createdOrUpdatedEntry = await requestQueue.add(() => {
      return destinationEntry ? updateDestinationWithSourceData(destinationEntry, entry.transformed) : createEntryInDestination(target, contentTypeId, entry.transformed);
    });
    creationSuccessNotifier(operation, createdOrUpdatedEntry);
    return createdOrUpdatedEntry;
  } catch (err) {
    /* If a field doesn't exist, it means it has been removed from the content types
     * In that case, the field is removed from the entry, and creation is attempted again.
    */
    if (skipContentModel && err.name === 'UnknownField') {
      const errors = (0, _object.get)(JSON.parse(err.message), 'details.errors');
      entry.transformed.fields = cleanupUnknownFields(entry.transformed.fields, errors);
      return createEntry({
        entry,
        target,
        skipContentModel,
        destinationEntitiesById,
        requestQueue
      });
    }
    err.entity = entry;
    _logging.logEmitter.emit('error', err);

    // No need to pass this entry down to publishing if it wasn't created
    return null;
  }
}
function updateDestinationWithSourceData(destinationEntity, sourceEntity) {
  const plainData = getPlainData(sourceEntity);
  (0, _object.assign)(destinationEntity, plainData);
  return destinationEntity.update();
}
function createInDestination(context, sourceEntity) {
  const {
    type,
    target
  } = context;
  if (type === 'Tag') {
    // tags are created with a different signature
    return createTagInDestination(context, sourceEntity);
  }
  const id = (0, _object.get)(sourceEntity, 'sys.id');
  const plainData = getPlainData(sourceEntity);
  return id ? target[`create${type}WithId`](id, plainData) : target[`create${type}`](plainData);
}
function createEntryInDestination(space, contentTypeId, sourceEntity) {
  const id = sourceEntity.sys.id;
  const plainData = getPlainData(sourceEntity);
  return id ? space.createEntryWithId(contentTypeId, id, plainData) : space.createEntry(contentTypeId, plainData);
}
function createTagInDestination(context, sourceEntity) {
  const id = sourceEntity.sys.id;
  const visibility = sourceEntity.sys.visibility || 'private';
  const name = sourceEntity.name;
  return context.target.createTag(id, name, visibility);
}

/**
 * Handles entity creation errors.
 * If the error is a VersionMismatch the error is thrown and a message is returned
 * instructing the user on what this situation probably means.
 */
function handleCreationErrors(entity, err) {
  // Handle the case where a locale already exists and skip it
  if ((0, _object.get)(err, 'error.sys.id') === 'ValidationFailed') {
    const errors = (0, _object.get)(err, 'error.details.errors');
    if (errors && errors.length > 0 && errors[0].name === 'taken') {
      return entity;
    }
  }
  err.entity = entity.original;
  _logging.logEmitter.emit('error', err);

  // No need to pass this entity down to publishing if it wasn't created
  return null;
}
function cleanupUnknownFields(fields, errors) {
  return (0, _object.omitBy)(fields, (field, fieldId) => {
    return (0, _collection.find)(errors, error => {
      const [, errorFieldId] = error.path;
      return error.name === 'unknown' && errorFieldId === fieldId;
    });
  });
}
function getDestinationEntityForSourceEntity(destinationEntitiesById, sourceEntity) {
  return destinationEntitiesById.get((0, _object.get)(sourceEntity, 'sys.id')) || null;
}
function creationSuccessNotifier(method, createdEntity) {
  const verb = method[0].toUpperCase() + method.substr(1, method.length) + 'd';
  _logging.logEmitter.emit('info', `${verb} ${createdEntity.sys.type} ${(0, _getEntityName.default)(createdEntity)}`);
  return createdEntity;
}
function getPlainData(entity) {
  const data = entity.toPlainObject ? entity.toPlainObject() : entity;
  return (0, _object.omit)(data, 'sys');
}