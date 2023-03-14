"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _yargs = _interopRequireDefault(require("yargs"));
var packageFile = _interopRequireWildcard(require("../package"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = _yargs.default.version(packageFile.version || 'Version only available on installed package').usage('Usage: $0 [options]').option('space-id', {
  describe: 'ID of the destination space',
  type: 'string',
  demand: true
}).option('environment-id', {
  describe: 'ID the environment in the destination space',
  type: 'string',
  default: 'master',
  demand: false
}).option('management-token', {
  describe: 'Contentful management API token for the destination space',
  type: 'string',
  demand: true
}).option('content-file', {
  describe: 'JSON file that contains data to be import to your space',
  type: 'string',
  demand: true
}).option('content-model-only', {
  describe: 'Import only content types',
  type: 'boolean',
  default: false
}).option('skip-content-model', {
  describe: 'Skip importing content types and locales',
  type: 'boolean',
  default: false
}).option('skip-locales', {
  describe: 'Skip importing locales',
  type: 'boolean',
  default: false
}).option('skip-content-publishing', {
  describe: 'Skips content publishing. Creates content but does not publish it',
  type: 'boolean',
  default: false
}).option('upload-assets', {
  describe: 'Uses local asset files and uploads them instead of pointing to the URLs of previously uploaded assets. Requires assets-directory',
  type: 'boolean',
  default: false
}).implies('upload-assets', 'assets-directory').option('assets-directory', {
  describe: 'Path to a directory with an asset export made using the downloadAssets option to upload those files instead of pointing to the URLs of previously uploaded assets. Requires upload-assets',
  type: 'string'
}).implies('assets-directory', 'upload-assets').option('error-log-file', {
  describe: 'Full path to the error log file',
  type: 'string'
}).option('host', {
  describe: 'Management API host',
  type: 'string',
  default: 'api.contentful.com'
}).option('proxy', {
  describe: 'Proxy configuration in HTTP auth format: [http|https]://host:port or [http|https]://user:password@host:port',
  type: 'string'
}).option('raw-proxy', {
  describe: 'Pass proxy config to Axios instead of creating a custom httpsAgent',
  type: 'boolean',
  default: false
}).option('rate-limit', {
  describe: 'Maximum requests per second used for API requests',
  type: 'number',
  default: 7
}).option('header', {
  alias: 'H',
  type: 'string',
  describe: 'Pass an additional HTTP Header'
}).config('config', 'An optional configuration JSON file containing all the options for a single run').argv;
exports.default = _default;
module.exports = exports.default;