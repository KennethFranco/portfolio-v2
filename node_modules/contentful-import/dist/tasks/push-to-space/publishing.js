"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.archiveEntities = archiveEntities;
exports.publishEntities = publishEntities;
var _getEntityName = _interopRequireDefault(require("contentful-batch-libs/dist/get-entity-name"));
var _logging = require("contentful-batch-libs/dist/logging");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Publish a list of entities.
 * Does not return a rejected promise in the case of an error, pushing it
 * to an error buffer instead.
 */
async function publishEntities({
  entities,
  requestQueue
}) {
  const entitiesToPublish = entities.filter(entity => {
    if (!entity || !entity.publish) {
      _logging.logEmitter.emit('warning', `Unable to publish ${(0, _getEntityName.default)(entity)}`);
      return false;
    }
    return true;
  });
  if (entitiesToPublish.length === 0) {
    _logging.logEmitter.emit('info', 'Skipping publishing since zero valid entities passed');
    return [];
  }
  const entity = entities[0].original || entities[0];
  const type = entity.sys.type || 'unknown type';
  _logging.logEmitter.emit('info', `Publishing ${entities.length} ${type}s`);
  const result = await runQueue(entitiesToPublish, [], requestQueue);
  _logging.logEmitter.emit('info', `Successfully published ${result.length} ${type}s`);
  return result;
}
async function archiveEntities({
  entities,
  requestQueue
}) {
  const entitiesToArchive = entities.filter(entity => {
    if (!entity || !entity.archive) {
      _logging.logEmitter.emit('warning', `Unable to archive ${(0, _getEntityName.default)(entity)}`);
      return false;
    }
    return true;
  });
  if (entitiesToArchive.length === 0) {
    _logging.logEmitter.emit('info', 'Skipping archiving since zero valid entities passed');
    return [];
  }
  const entity = entities[0].original || entities[0];
  const type = entity.sys.type || 'unknown type';
  _logging.logEmitter.emit('info', `Archiving ${entities.length} ${type}s`);
  const pendingArchivedEntities = entitiesToArchive.map(entity => {
    return requestQueue.add(async () => {
      try {
        const archivedEntity = await entity.archive();
        return archivedEntity;
      } catch (err) {
        err.entity = entity;
        _logging.logEmitter.emit('error', err);
        return null;
      }
    });
  });
  const allPossiblyArchivedEntities = await Promise.all(pendingArchivedEntities);
  const allArchivedEntities = allPossiblyArchivedEntities.filter(entity => entity);
  _logging.logEmitter.emit('info', `Successfully archived ${allArchivedEntities.length} ${type}s`);
  return allArchivedEntities;
}
async function runQueue(queue, result = [], requestQueue) {
  const publishedEntities = [];
  for (const entity of queue) {
    _logging.logEmitter.emit('info', `Publishing ${entity.sys.type} ${(0, _getEntityName.default)(entity)}`);
    try {
      const publishedEntity = await requestQueue.add(() => entity.publish());
      publishedEntities.push(publishedEntity);
    } catch (err) {
      err.entity = entity;
      _logging.logEmitter.emit('error', err);
    }
  }
  result = [...result, ...publishedEntities];
  const publishedEntityIds = new Set(publishedEntities.map(entity => entity.sys.id));
  const unpublishedEntities = queue.filter(entity => !publishedEntityIds.has(entity.sys.id));
  if (unpublishedEntities.length > 0) {
    if (queue.length === unpublishedEntities.length) {
      // Fail when queue could not publish at least one item
      const unpublishedEntityNames = unpublishedEntities.map(_getEntityName.default).join(', ');
      _logging.logEmitter.emit('error', `Could not publish the following entities: ${unpublishedEntityNames}`);
    } else {
      // Rerun queue with unpublished entities
      return runQueue(unpublishedEntities, result, requestQueue);
    }
  }
  // Return only published entities + last result
  return result;
}