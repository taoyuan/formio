"use strict";

const _ = require('lodash');

const Types = {
  Type: require('./type'),
  DateTime: require('./datetime')
};

exports.Types = exports.types = Types;

function matchType(type, Type) {
  var types = Type.types || Type.type;
  if (!types) return false;

  types = Array.isArray(types) ? types : [types];

  return _.includes(_.map(types, function (t) {
    return t.toLowerCase()
  }), type.toLowerCase());
}

exports.createType = function (component) {
  const names = Object.keys(Types);
  for (var i = 0; i < names.length; i++) {
    const T = Types[names[i]];
    if (component.type && T.types && matchType(component.type, T)) {
      return new T(component.key, component);
    }
  }
  return new Types.Type(component.key, component);
};

exports.createPropertiesFromComponents = function (components) {
  if (!Array.isArray(components)) {
    throw new Error('`components` must be array');
  }
  const properties = {};
  components.map(function (component) {
    properties[component.key] = exports.createType(component);
  });
  return properties;
};

exports.coerceQuery = function (form, query) {

  const properties = form.properties;

  // Get the filters and omit the limit, skip, select, and sort.
  const filters = _.omit(query, 'limit', 'skip', 'select', 'sort');

  // Iterate through each filter.
  _.each(filters, function (value, name) {

    // Get the filter object.
    var field = name.split('__')[0];
    const parts = field.split('.');
    if (parts[0] === 'data') {
      field = parts.slice(1).join('.');
    }

    if (properties[field]) {
      query[name] = properties[field].cast(value);
    }
  });

  return query;
};