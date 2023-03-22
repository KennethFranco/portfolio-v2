"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assets = assets;
exports.contentTypes = contentTypes;
exports.entries = entries;
exports.locales = locales;
exports.tags = tags;
exports.webhooks = webhooks;
var _object = require("lodash/object");
var _collection = require("lodash/collection");
/**
 * Default transformer methods for each kind of entity.
 *
 * In the case of assets it also changes the asset url to the upload property
 * as the whole upload process needs to be followed again.
 */

function contentTypes(contentType) {
  return contentType;
}
function tags(tag) {
  return tag;
}
function entries(entry, _, tagsEnabled = false) {
  return removeMetadataTags(entry, tagsEnabled);
}
function webhooks(webhook) {
  // Workaround for webhooks with credentials
  if (webhook.httpBasicUsername) {
    delete webhook.httpBasicUsername;
  }

  // Workaround for webhooks with secret headers
  if (webhook.headers) {
    webhook.headers = webhook.headers.filter(header => !header.secret);
  }
  return webhook;
}
function assets(asset, _, tagsEnabled = false) {
  const transformedAsset = (0, _object.omit)(asset, 'sys');
  transformedAsset.sys = (0, _object.pick)(asset.sys, 'id');
  transformedAsset.fields = (0, _object.pick)(asset.fields, 'title', 'description');
  transformedAsset.fields.file = (0, _collection.reduce)(asset.fields.file, (newFile, localizedFile, locale) => {
    newFile[locale] = (0, _object.pick)(localizedFile, 'contentType', 'fileName');
    if (!localizedFile.uploadFrom) {
      const assetUrl = localizedFile.url || localizedFile.upload;
      newFile[locale].upload = `${/^(http|https):\/\//i.test(assetUrl) ? '' : 'https:'}${assetUrl}`;
    } else {
      newFile[locale].uploadFrom = localizedFile.uploadFrom;
    }
    return newFile;
  }, {});
  return removeMetadataTags(transformedAsset, tagsEnabled);
}
function locales(locale, destinationLocales) {
  const transformedLocale = (0, _object.pick)(locale, 'code', 'name', 'contentManagementApi', 'contentDeliveryApi', 'fallbackCode', 'optional');
  const destinationLocale = (0, _collection.find)(destinationLocales, {
    code: locale.code
  });
  if (destinationLocale) {
    // This will implicitly remove the locale ID
    // which then causes the create path to not pick `createLocaleWithId` but `createLocale` instead
    transformedLocale.sys = (0, _object.pick)(destinationLocale.sys, 'id');
  }
  return transformedLocale;
}
function removeMetadataTags(entity, tagsEnabled = false) {
  if (!tagsEnabled) {
    delete entity.metadata;
  }
  return entity;
}