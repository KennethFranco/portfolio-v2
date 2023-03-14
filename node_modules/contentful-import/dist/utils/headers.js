"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeadersConfig = getHeadersConfig;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Turn header option into an object. Invalid header values
 * are ignored.
 *
 * @example
 * getHeadersConfig('Accept: Any')
 * // -> {Accept: 'Any'}
 *
 * @example
 * getHeadersConfig(['Accept: Any', 'X-Version: 1'])
 * // -> {Accept: 'Any', 'X-Version': '1'}
 *
 * @param value {string|string[]}
 */
function getHeadersConfig(value) {
  if (!value) {
    return {};
  }
  const values = Array.isArray(value) ? value : [value];
  return values.reduce((headers, value) => {
    value = value.trim();
    const separatorIndex = value.indexOf(':');

    // Invalid header format
    if (separatorIndex === -1) {
      return headers;
    }
    const headerKey = value.slice(0, separatorIndex).trim();
    const headerValue = value.slice(separatorIndex + 1).trim();
    return _objectSpread(_objectSpread({}, headers), {}, {
      [headerKey]: headerValue
    });
  }, {});
}