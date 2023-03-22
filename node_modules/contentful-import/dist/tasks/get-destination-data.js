"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDestinationData;
var _bluebird = _interopRequireDefault(require("bluebird"));
var _logging = require("contentful-batch-libs/dist/logging");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const BATCH_CHAR_LIMIT = 1990;
const BATCH_SIZE_LIMIT = 100;
const METHODS = {
  contentTypes: {
    name: 'content types',
    method: 'getContentTypes'
  },
  locales: {
    name: 'locales',
    method: 'getLocales'
  },
  entries: {
    name: 'entries',
    method: 'getEntries'
  },
  assets: {
    name: 'assets',
    method: 'getAssets'
  }
};
async function batchedIdQuery({
  environment,
  type,
  ids,
  requestQueue
}) {
  const method = METHODS[type].method;
  const entityTypeName = METHODS[type].name;
  const batches = getIdBatches(ids);
  let totalFetched = 0;
  const allPendingResponses = batches.map(idBatch => {
    // TODO: add batch count to indicate that it's running
    return requestQueue.add(async () => {
      const response = await environment[method]({
        'sys.id[in]': idBatch,
        limit: idBatch.split(',').length
      });
      totalFetched = totalFetched + response.items.length;
      _logging.logEmitter.emit('info', `Fetched ${totalFetched} of ${response.total} ${entityTypeName}`);
      return response.items;
    });
  });
  const responses = await _bluebird.default.all(allPendingResponses);
  return responses.flat();
}
function getIdBatches(ids) {
  const batches = [];
  let currentBatch = '';
  let currentSize = 0;
  while (ids.length > 0) {
    const id = ids.splice(0, 1);
    currentBatch += id;
    currentSize = currentSize + 1;
    if (currentSize === BATCH_SIZE_LIMIT || currentBatch.length > BATCH_CHAR_LIMIT || ids.length === 0) {
      batches.push(currentBatch);
      currentBatch = '';
      currentSize = 0;
    } else {
      currentBatch += ',';
    }
  }
  return batches;
}

/**
 * Gets content from a space which will have content copied to it, based on a
 * collection of existing content.
 *
 * Only the supplied entry/asset/contentType/locale IDs will be retrieved.
 * All tags will be retrieved.
 *
 */

async function getDestinationData({
  client,
  spaceId,
  environmentId,
  sourceData,
  contentModelOnly,
  skipLocales,
  skipContentModel,
  requestQueue
}) {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const result = {
    contentTypes: [],
    tags: [],
    locales: [],
    entries: [],
    assets: []
  };

  // Make sure all required properties are available and at least an empty array
  sourceData = _objectSpread(_objectSpread({}, result), sourceData);
  if (!skipContentModel) {
    const contentTypeIds = sourceData.contentTypes.map(e => e.sys.id);
    result.contentTypes = batchedIdQuery({
      environment,
      type: 'contentTypes',
      ids: contentTypeIds,
      requestQueue
    });
    if (!skipLocales) {
      const localeIds = sourceData.locales.map(e => e.sys.id);
      result.locales = batchedIdQuery({
        environment,
        type: 'locales',
        ids: localeIds,
        requestQueue
      });
    }
  }

  // include tags even if contentModelOnly = true
  result.tags = environment.getTags().then(response => response.items).catch(e => {
    // users without access to Tags will get 404
    // if they dont have access, remove tags array so they're not handled in future steps
    delete result.tags;
  });
  if (contentModelOnly) {
    return _bluebird.default.props(result);
  }
  const entryIds = sourceData.entries.map(e => e.sys.id);
  const assetIds = sourceData.assets.map(e => e.sys.id);
  result.entries = batchedIdQuery({
    environment,
    type: 'entries',
    ids: entryIds,
    requestQueue
  });
  result.assets = batchedIdQuery({
    environment,
    type: 'assets',
    ids: assetIds,
    requestQueue
  });
  result.webhooks = [];
  return _bluebird.default.props(result);
}
module.exports = exports.default;