/* jshint esnext: true */

'use strict';

const _ = require('lodash');
const minimatch = require('minimatch');

class KeyFinder {
  constructor (obj) {
    this.obj = this._parseJson(obj);
  }
  find (query) {
    if (_.isRegExp(query)) return this._findByRegExp(query);
    if (_.isString(query)) return this._findByString(query);
    throw new Error('`query` must be either RegExp or String');
  }
  findFirst (query) {
    if (_.isRegExp(query)) return this._findFirstByRegExp(query);
    if (_.isString(query)) return this._findFirstByString(query);
    throw new Error('`query` must be either RegExp or String');
  }
  _parseJson (obj) {
    // TODO add tests
    if (_.isString(obj)) return JSON.parse(obj);
    if (_.isObject(obj)) return obj;
  }
  _findByString (str) {
    return this._getMatchesForQuery(function (key) {
      return minimatch(key, str);
    });
  }
  _findByRegExp (regexp) {
    return this._getMatchesForQuery(function (key) {
      return key.match(regexp);
    });
  }
  _findFirstByString (str) {
    return this._getFirstMatchForQuery(function (key) {
      return minimatch(key, str);
    });
  }
  _findFirstByRegExp (regexp) {
    return this._getFirstMatchForQuery(function (key) {
      return key.match(regexp);
    });
  }
  _getMatchesForQuery (checkFn) {
    var matches = [];
    for (var key of Object.keys(this.obj)) {
      if (checkFn(key)) matches.push(this._getResultForKey(key));
    }
    return matches;
  }
  _getFirstMatchForQuery (checkFn) {
    for (var key of Object.keys(this.obj)) {
      if (checkFn(key)) return this._getResultForKey(key);
    }
  }
  _getResultForKey (key) {
    return {
      key: key,
      value: this._getValue(key)
    };
  }
  _getValue (key) {
    return this.obj[key];
  }
}

module.exports = KeyFinder;
