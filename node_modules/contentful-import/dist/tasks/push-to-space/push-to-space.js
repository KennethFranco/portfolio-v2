"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pushToSpace;
var _listr = _interopRequireDefault(require("listr"));
var _listrVerboseRenderer = _interopRequireDefault(require("listr-verbose-renderer"));
var _logging = require("contentful-batch-libs/dist/logging");
var _listr2 = require("contentful-batch-libs/dist/listr");
var assets = _interopRequireWildcard(require("./assets"));
var creation = _interopRequireWildcard(require("./creation"));
var publishing = _interopRequireWildcard(require("./publishing"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const DEFAULT_CONTENT_STRUCTURE = {
  entries: [],
  assets: [],
  contentTypes: [],
  tags: [],
  locales: [],
  webhooks: [],
  editorInterfaces: []
};

/**
 * Pushes all changes to a given space. Handles (un)publishing
 * as well as delays after creation and before publishing.
 *
 * Creates everything in the right order so that a content type for a given entry
 * is there when entry creation for that content type is attempted.
 *
 * Allows only content model or only content pushing.
 *
 * Options:
 * - sourceData: see DEFAULT_CONTENT_STRUCTURE
 * - destinationData: see DEFAULT_CONTENT_STRUCTURE
 * - client: preconfigured management API client
 * - spaceId: ID of space content is being copied to
 * - contentModelOnly: synchronizes only content types and locales
 * - skipLocales: skips locales when synchronizing the content model
 * - skipContentModel: synchronizes only entries and assets
 * - skipContentPublishing: create content but don't publish it
 * - uploadAssets: upload exported files instead of pointing to an existing URL
 * - assetsDirectory: path to exported asset files to be uploaded instead of pointing to an existing URL
 */

function pushToSpace({
  sourceData,
  destinationData = {},
  client,
  spaceId,
  environmentId,
  contentModelOnly,
  skipContentModel,
  skipLocales,
  skipContentPublishing,
  timeout,
  retryLimit,
  listrOptions,
  uploadAssets,
  assetsDirectory,
  requestQueue
}) {
  sourceData = _objectSpread(_objectSpread({}, DEFAULT_CONTENT_STRUCTURE), sourceData);
  destinationData = _objectSpread(_objectSpread({}, DEFAULT_CONTENT_STRUCTURE), destinationData);
  listrOptions = listrOptions || {
    renderer: _listrVerboseRenderer.default
  };
  const destinationDataById = {};
  for (const [entityType, entities] of Object.entries(destinationData)) {
    const entitiesById = new Map();
    for (const entity of entities) {
      entitiesById.set(entity.sys.id, entity);
    }
    destinationDataById[entityType] = entitiesById;
  }
  return new _listr.default([{
    title: 'Connecting to space',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const space = await client.getSpace(spaceId);
      const environment = await space.getEnvironment(environmentId);
      ctx.space = space;
      ctx.environment = environment;
    })
  }, {
    title: 'Importing Locales',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const locales = await creation.createLocales({
        context: {
          target: ctx.environment,
          type: 'Locale'
        },
        entities: sourceData.locales,
        destinationEntitiesById: destinationDataById.locales,
        requestQueue
      });
      ctx.data.locales = locales;
    }),
    skip: () => skipContentModel || skipLocales
  }, {
    title: 'Importing Content Types',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const contentTypes = await creation.createEntities({
        context: {
          target: ctx.environment,
          type: 'ContentType'
        },
        entities: sourceData.contentTypes,
        destinationEntitiesById: destinationDataById.contentTypes,
        requestQueue
      });
      ctx.data.contentTypes = contentTypes;
    }),
    skip: () => skipContentModel
  }, {
    title: 'Publishing Content Types',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const publishedContentTypes = await publishEntities({
        entities: ctx.data.contentTypes,
        sourceEntities: sourceData.contentTypes,
        requestQueue
      });
      ctx.data.contentTypes = publishedContentTypes;
    }),
    skip: ctx => skipContentModel
  }, {
    title: 'Importing Tags',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const tags = await creation.createEntities({
        context: {
          target: ctx.environment,
          type: 'Tag'
        },
        entities: sourceData.tags,
        destinationEntitiesById: destinationDataById.tags,
        requestQueue
      });
      ctx.data.tags = tags;
    }),
    // we remove `tags` from destination data if an error was thrown trying to access them
    // this means the user doesn't have access to this feature, skip importing tags
    skip: () => !destinationDataById.tags
  }, {
    title: 'Importing Editor Interfaces',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const allEditorInterfacesBeingFetched = ctx.data.contentTypes.map(async contentType => {
        const editorInterface = sourceData.editorInterfaces.find(editorInterface => {
          return editorInterface.sys.contentType.sys.id === contentType.sys.id;
        });
        if (!editorInterface) {
          return;
        }
        try {
          const ctEditorInterface = await requestQueue.add(() => ctx.environment.getEditorInterfaceForContentType(contentType.sys.id));
          _logging.logEmitter.emit('info', `Fetched editor interface for ${contentType.name}`);
          ctEditorInterface.controls = editorInterface.controls;
          ctEditorInterface.groupControls = editorInterface.groupControls;
          ctEditorInterface.editorLayout = editorInterface.editorLayout;
          const updatedEditorInterface = await requestQueue.add(() => ctEditorInterface.update());
          return updatedEditorInterface;
        } catch (err) {
          err.entity = editorInterface;
          throw err;
        }
      });
      const allEditorInterfaces = await Promise.all(allEditorInterfacesBeingFetched);
      const editorInterfaces = allEditorInterfaces.filter(editorInterface => editorInterface);
      ctx.data.editorInterfaces = editorInterfaces;
    }),
    skip: ctx => skipContentModel || ctx.data.contentTypes.length === 0
  }, {
    title: 'Uploading Assets',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const allPendingUploads = [];
      for (const asset of sourceData.assets) {
        for (const file of Object.values(asset.transformed.fields.file)) {
          allPendingUploads.push(requestQueue.add(async () => {
            try {
              _logging.logEmitter.emit('info', `Uploading Asset file ${file.upload}`);
              const assetStream = await assets.getAssetStreamForURL(file.upload, assetsDirectory);
              const upload = await ctx.environment.createUpload({
                fileName: asset.transformed.sys.id,
                file: assetStream
              });
              delete file.upload;
              file.uploadFrom = {
                sys: {
                  type: 'Link',
                  linkType: 'Upload',
                  id: upload.sys.id
                }
              };
              return upload;
            } catch (err) {
              _logging.logEmitter.emit('error', err);
            }
          }));
        }
      }

      // We call the pending uploads for the side effects
      // so we can just await all pending ones that are queued
      const uploads = await Promise.all(allPendingUploads);
      ctx.data.uploadedAssetFiles = uploads;
    }),
    skip: ctx => !uploadAssets || !sourceData.assets.length
  }, {
    title: 'Importing Assets',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const assetsToProcess = await creation.createEntities({
        context: {
          target: ctx.environment,
          type: 'Asset'
        },
        entities: sourceData.assets,
        destinationEntitiesById: destinationDataById.assets,
        requestQueue
      });
      const processedAssets = await assets.processAssets({
        assets: assetsToProcess,
        timeout,
        retryLimit,
        requestQueue
      });
      ctx.data.assets = processedAssets;
    }),
    skip: ctx => contentModelOnly
  }, {
    title: 'Publishing Assets',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const publishedAssets = await publishEntities({
        entities: ctx.data.assets,
        sourceEntities: sourceData.assets,
        requestQueue
      });
      ctx.data.publishedAssets = publishedAssets;
    }),
    skip: ctx => contentModelOnly || skipContentPublishing
  }, {
    title: 'Archiving Assets',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const archivedAssets = await archiveEntities({
        entities: ctx.data.assets,
        sourceEntities: sourceData.assets,
        requestQueue
      });
      ctx.data.archivedAssets = archivedAssets;
    }),
    skip: ctx => contentModelOnly || skipContentPublishing
  }, {
    title: 'Importing Content Entries',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const entries = await creation.createEntries({
        context: {
          target: ctx.environment,
          skipContentModel
        },
        entities: sourceData.entries,
        destinationEntitiesById: destinationDataById.entries,
        requestQueue
      });
      ctx.data.entries = entries;
    }),
    skip: ctx => contentModelOnly
  }, {
    title: 'Publishing Content Entries',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const publishedEntries = await publishEntities({
        entities: ctx.data.entries,
        sourceEntities: sourceData.entries,
        requestQueue
      });
      ctx.data.publishedEntries = publishedEntries;
    }),
    skip: ctx => contentModelOnly || skipContentPublishing
  }, {
    title: 'Archiving Entries',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const archivedEntries = await archiveEntities({
        entities: ctx.data.entries,
        sourceEntities: sourceData.entries,
        requestQueue
      });
      ctx.data.archivedEntries = archivedEntries;
    }),
    skip: ctx => contentModelOnly || skipContentPublishing
  }, {
    title: 'Creating Web Hooks',
    task: (0, _listr2.wrapTask)(async (ctx, task) => {
      const webhooks = await creation.createEntities({
        context: {
          target: ctx.space,
          type: 'Webhook'
        },
        entities: sourceData.webhooks,
        destinationEntitiesById: destinationDataById.webhooks,
        requestQueue
      });
      ctx.data.webhooks = webhooks;
    }),
    skip: ctx => contentModelOnly || environmentId !== 'master' && 'Webhooks can only be imported in master environment'
  }], listrOptions);
}
function archiveEntities({
  entities,
  sourceEntities,
  requestQueue
}) {
  const entityIdsToArchive = sourceEntities.filter(({
    original
  }) => original.sys.archivedVersion).map(({
    original
  }) => original.sys.id);
  const entitiesToArchive = entities.filter(entity => entityIdsToArchive.indexOf(entity.sys.id) !== -1);
  return publishing.archiveEntities({
    entities: entitiesToArchive,
    requestQueue
  });
}
function publishEntities({
  entities,
  sourceEntities,
  requestQueue
}) {
  // Find all entities in source content which are published
  const entityIdsToPublish = sourceEntities.filter(({
    original
  }) => original.sys.publishedVersion).map(({
    original
  }) => original.sys.id);

  // Filter imported entities and publish only these who got published in the source
  const entitiesToPublish = entities.filter(entity => entityIdsToPublish.indexOf(entity.sys.id) !== -1);
  return publishing.publishEntities({
    entities: entitiesToPublish,
    requestQueue
  });
}
module.exports = exports.default;