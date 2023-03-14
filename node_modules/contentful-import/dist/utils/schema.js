"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webhookSchema = exports.tagSchema = exports.payloadSchema = exports.localeSchema = exports.entrySchema = exports.editorInterfaceSchema = exports.contentTypeSchema = exports.assetSchema = void 0;
var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const entrySchema = {
  sys: _joi.default.object(),
  fields: _joi.default.object()
};
exports.entrySchema = entrySchema;
const tagSchema = {
  name: _joi.default.string().required(),
  sys: _joi.default.object()
};
exports.tagSchema = tagSchema;
const contentTypeSchema = {
  sys: _joi.default.object(),
  fields: _joi.default.array().required().items(_joi.default.object().keys({
    id: _joi.default.string().required(),
    name: _joi.default.string().required(),
    type: _joi.default.string().required().regex(/^Symbol|Text|Integer|Number|Date|Object|Boolean|Array|Link|Location$/),
    validations: _joi.default.array(),
    disabled: _joi.default.boolean(),
    omitted: _joi.default.boolean(),
    required: _joi.default.boolean(),
    localized: _joi.default.boolean(),
    linkType: _joi.default.string().when('type', {
      is: 'Link',
      then: _joi.default.string().regex(/^Asset|Entry$/),
      otherwise: _joi.default.forbidden()
    })
  }))
};
exports.contentTypeSchema = contentTypeSchema;
const assetSchema = {
  sys: _joi.default.object(),
  fields: _joi.default.object({
    file: _joi.default.object().pattern(/.+/, _joi.default.object({
      url: _joi.default.string().required(),
      details: _joi.default.object({
        size: _joi.default.number(),
        image: _joi.default.object({
          width: _joi.default.number(),
          height: _joi.default.number()
        })
      }),
      fileName: _joi.default.string().required(),
      contentType: _joi.default.string().required()
    }))
  }).required()
};
exports.assetSchema = assetSchema;
const editorInterfaceSchema = {
  sys: _joi.default.object(),
  controls: _joi.default.array().items({
    fieldId: _joi.default.string(),
    widgetId: _joi.default.string()
  })
};
exports.editorInterfaceSchema = editorInterfaceSchema;
const localeSchema = {
  name: _joi.default.string().required(),
  internal_code: _joi.default.string(),
  code: _joi.default.string().required(),
  fallbackCode: _joi.default.string().allow(null),
  default: _joi.default.boolean(),
  contentManagementApi: _joi.default.boolean(),
  contentDeliveryApi: _joi.default.boolean(),
  optional: _joi.default.boolean(),
  sys: _joi.default.object()
};
exports.localeSchema = localeSchema;
const webhookSchema = {
  name: _joi.default.string(),
  url: _joi.default.string().replace(/{[^}{]+?}/g, 'x').regex(/^https?:\/\/[^ /}{][^ }{]*$/i).required(),
  topics: _joi.default.array().required(),
  httpBasicUsername: _joi.default.string().allow('', null)
};

/**
 * @returns normalized validation object. Don't use normalized output as payload
 */
exports.webhookSchema = webhookSchema;
const payloadSchema = _joi.default.object({
  entries: _joi.default.array().items(entrySchema),
  contentTypes: _joi.default.array().items(contentTypeSchema),
  tags: _joi.default.array().items(tagSchema),
  assets: _joi.default.array().items(assetSchema),
  locales: _joi.default.array().items(localeSchema),
  editorInterfaces: _joi.default.array().items(editorInterfaceSchema),
  webhooks: _joi.default.array().items(webhookSchema)
});
exports.payloadSchema = payloadSchema;