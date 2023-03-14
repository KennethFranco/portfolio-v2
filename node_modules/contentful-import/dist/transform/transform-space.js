"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _object = require("lodash/object");
var defaultTransformers = _interopRequireWildcard(require("./transformers"));
var _sortEntries = _interopRequireDefault(require("../utils/sort-entries"));
var _sortLocales = _interopRequireDefault(require("../utils/sort-locales"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const spaceEntities = ['contentTypes', 'entries', 'assets', 'locales', 'webhooks', 'tags'];

/**
 * Run transformer methods on each item for each kind of entity, in case there
 * is a need to transform data when copying it to the destination space
 */
function _default(sourceData, destinationData, customTransformers, entities = spaceEntities) {
  const transformers = (0, _object.defaults)(customTransformers, defaultTransformers);
  const baseSpaceData = (0, _object.omit)(sourceData, ...entities);
  sourceData.locales = (0, _sortLocales.default)(sourceData.locales);
  const tagsEnabled = !!destinationData.tags;
  return entities.reduce((transformedSpaceData, type) => {
    // tags don't contain links to other entities, don't need to be sorted
    const sortedEntities = type === 'tags' ? sourceData[type] : (0, _sortEntries.default)(sourceData[type]);
    const transformedEntities = sortedEntities.map(entity => ({
      original: entity,
      transformed: transformers[type](entity, destinationData[type], tagsEnabled)
    }));
    transformedSpaceData[type] = transformedEntities;
    return transformedSpaceData;
  }, baseSpaceData);
}
module.exports = exports.default;