"use strict";

const util = require('util');
const Type = require('./type');
const CastError = Type.CastError;

module.exports = DateTime;

function DateTime(key, options) {
  if (!(this instanceof DateTime)) {
    return new DateTime(key, options);
  }

  Type.call(this, key, options);
}

util.inherits(DateTime, Type);

DateTime.types = ['date', 'time', 'datetime'];


/**
 * Casts to date
 *
 * @param {Object} value to cast
 * @api private
 */

DateTime.prototype.cast = function(value) {
  // If null or undefined
  if (value === null || value === void 0 || value === '') {
    return null;
  }

  if (value instanceof Date) {
    if (isNaN(value.valueOf())) {
      throw new CastError('date', value, this.path);
    }

    return value;
  }

  var date;

  if (typeof value === 'boolean') {
    throw new CastError('date', value, this.path);
  }

  if (value instanceof Number || typeof value === 'number'
    || String(value) == Number(value)) {
    // support for timestamps
    date = new Date(Number(value));
  } else if (value.valueOf) {
    // support for moment.js
    date = new Date(value.valueOf());
  }

  if (!isNaN(date.valueOf())) {
    return date;
  }

  throw new CastError('date', value, this.path);
};
