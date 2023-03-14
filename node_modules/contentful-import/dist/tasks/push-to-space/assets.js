"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetStreamForURL = getAssetStreamForURL;
exports.processAssets = processAssets;
var _fs = _interopRequireDefault(require("fs"));
var _path = require("path");
var _util = require("util");
var _getEntityName = _interopRequireDefault(require("contentful-batch-libs/dist/get-entity-name"));
var _logging = require("contentful-batch-libs/dist/logging");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const stat = (0, _util.promisify)(_fs.default.stat);
async function getAssetStreamForURL(url, assetsDirectory) {
  const [, assetPath] = url.split('//');
  const filePath = (0, _path.join)(assetsDirectory, assetPath);
  try {
    await stat(filePath);
    return _fs.default.createReadStream(filePath);
  } catch (err) {
    const error = new Error('Cannot open asset from filesystem');
    error.filePath = filePath;
    throw error;
  }
}
async function processAssets({
  assets,
  timeout,
  retryLimit,
  requestQueue
}) {
  const pendingProcessingAssets = assets.map(asset => {
    return requestQueue.add(async () => {
      _logging.logEmitter.emit('info', `Processing Asset ${(0, _getEntityName.default)(asset)}`);
      const processingOptions = Object.assign({}, timeout && {
        processingCheckWait: timeout
      }, retryLimit && {
        processingCheckRetry: retryLimit
      });
      try {
        const processedAsset = await asset.processForAllLocales(processingOptions);
        return processedAsset;
      } catch (err) {
        err.entity = asset;
        _logging.logEmitter.emit('error', err);
        return null;
      }
    });
  });
  const potentiallyProcessedAssets = await Promise.all(pendingProcessingAssets);
  return potentiallyProcessedAssets.filter(asset => asset);
}