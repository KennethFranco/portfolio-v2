"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseOptions;
var _fs = _interopRequireDefault(require("fs"));
var _path = require("path");
var _format = _interopRequireDefault(require("date-fns/format"));
var _package = require("../package");
var _headers = require("./utils/headers");
var _proxy = require("contentful-batch-libs/dist/proxy");
var _addSequenceHeader = _interopRequireDefault(require("contentful-batch-libs/dist/add-sequence-header"));
var _jsonExt = require("@discoveryjs/json-ext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const SUPPORTED_ENTITY_TYPES = ['contentTypes', 'tags', 'entries', 'assets', 'locales', 'webhooks', 'editorInterfaces'];
async function parseOptions(params) {
  const defaultOptions = {
    skipContentModel: false,
    skipLocales: false,
    skipContentPublishing: false,
    useVerboseRenderer: false,
    environmentId: 'master',
    rawProxy: false,
    uploadAssets: false,
    rateLimit: 7
  };
  const configFile = params.config ? require((0, _path.resolve)(process.cwd(), params.config)) : {};
  const options = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultOptions), configFile), params), {}, {
    headers: (0, _addSequenceHeader.default)(params.headers || (0, _headers.getHeadersConfig)(params.header))
  });

  // Validation
  if (!options.spaceId) {
    throw new Error('The `spaceId` option is required.');
  }
  if (!options.managementToken) {
    throw new Error('The `managementToken` option is required.');
  }
  if (!options.contentFile && !options.content) {
    throw new Error('Either the `contentFile` or `content` option are required.');
  }
  if (options.contentModelOnly && options.skipContentModel) {
    throw new Error('`contentModelOnly` and `skipContentModel` cannot be used together');
  }
  if (options.skipLocales && !options.contentModelOnly) {
    throw new Error('`skipLocales` can only be used together with `contentModelOnly`');
  }
  const proxySimpleExp = /.+:\d+/;
  const proxyAuthExp = /.+:.+@.+:\d+/;
  if (typeof options.proxy === 'string' && options.proxy && !(proxySimpleExp.test(options.proxy) || proxyAuthExp.test(options.proxy))) {
    throw new Error('Please provide the proxy config in the following format:\nhost:port or user:password@host:port');
  }
  options.startTime = new Date();
  if (!options.errorLogFile) {
    options.errorLogFile = (0, _path.resolve)(process.cwd(), `contentful-import-error-log-${options.spaceId}-${(0, _format.default)(options.startTime, "yyyy-MM-dd'T'HH-mm-ss")}.json`);
  } else {
    options.errorLogFile = (0, _path.resolve)(process.cwd(), options.errorLogFile);
  }
  options.accessToken = options.managementToken;
  if (!options.content) {
    // using a stream parser allows input files > 512 MB
    const fileStream = _fs.default.createReadStream(options.contentFile, {
      encoding: 'utf8'
    });
    options.content = await (0, _jsonExt.parseChunked)(fileStream);
  }

  // Clean up content to only include supported entity types
  Object.keys(options.content).forEach(type => {
    if (SUPPORTED_ENTITY_TYPES.indexOf(type) === -1) {
      delete options.content[type];
    }
  });
  SUPPORTED_ENTITY_TYPES.forEach(type => {
    options.content[type] = options.content[type] || [];
  });
  if (typeof options.proxy === 'string') {
    options.proxy = (0, _proxy.proxyStringToObject)(options.proxy);
  }
  if (!options.rawProxy && options.proxy) {
    options.httpsAgent = (0, _proxy.agentFromProxy)(options.proxy);
    delete options.proxy;
  }
  options.application = options.managementApplication || `contentful.import/${_package.version}`;
  options.feature = options.managementFeature || 'library-import';
  return options;
}
module.exports = exports.default;