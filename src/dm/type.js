"use strict";

const util = require('util');

module.exports = Type;

/**
 * 
 * @param path
 * @param options
 * @constructor
 */
function Type(path, options) {
  if (!(this instanceof Type)) {
    return new Type(key, options);
  }
  this.path = path;
  this.options = options;
}

Type.prototype.cast = function(value) {
  return value;
};


Type.CastError = CastError;
/**
 * Casting Error constructor.
 *
 * @param {String} type
 * @param {*} value
 * @param {String} [path]
 * @param {String} [reason]
 * @inherits Error
 * @api private
 */

function CastError(type, value, path, reason) {
  var stringValue = util.inspect(value);
  stringValue = stringValue.replace(/^'/, '"').replace(/'$/, '"');
  if (stringValue.charAt(0) !== '"') {
    stringValue = '"' + stringValue + '"';
  }
  Error.call(this, 'Cast to ' + type + ' failed for value ' +
    stringValue + ' at path "' + path + '"');
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this);
  } else {
    this.stack = new Error().stack;
  }
  this.name = 'CastError';
  this.kind = type;
  this.value = value;
  this.path = path;
  this.reason = reason;
}

util.inherits(CastError, Error);
