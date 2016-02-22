/* jshint esnext: true */

'use strict';

const ObjectPath = require('object-path');
const KeyFinder = require('./KeyFinder');

class JsonPackageFinder {
  constructor (config) {
    config = config || {};
    this._json = config.json;
    this._dependencyPaths = config.dependencyPaths;
  }
  uses (query) {
    return !!this.findFirst(query);
  }
  find (query) {
    var packages = [];
    for (var dependencyPath of this._dependencyPaths) {
      var matches = this._findInPath(query, dependencyPath);
      if (matches) packages = packages.concat(matches);
    }
    return packages;
  }
  findFirst (query) {
    for (var dependencyPath of this._dependencyPaths) {
      var match = this._findFirstInPath(query, dependencyPath);
      if (match) return match;
    }
  }
  _getDependencyGroup (path) {
    return ObjectPath.get(this._json, path);
  }
  _findInPath (query, path) {
    var dependencyGroup = this._getDependencyGroup(path);
    if (dependencyGroup) {
      var finder = new KeyFinder(dependencyGroup);
      var matches = finder.find(query);
      return matches.map(function (match) {
        return this._getResult(path, match);
      }.bind(this));
    }
  }
  _findFirstInPath (query, path) {
    var dependencyGroup = this._getDependencyGroup(path);
    if (dependencyGroup) {
      var finder = new KeyFinder(dependencyGroup);
      var match = finder.findFirst(query);
      if (match) return this._getResult(path, match);
    }
  }
  _getResult (path, match) {
    return {
      path: path,
      key: match.key,
      value: match.value
    };
  }
}

module.exports = JsonPackageFinder;
