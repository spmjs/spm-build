'use strict';

var join = require('path').join;
var exists = require('fs').existsSync;
var stat = require('fs').statSync;
var uniq = require('uniq');
var glob = require('glob');

module.exports = function(pkg) {
  var files = [];

  if (exists(join(pkg.dest, pkg.main))) {
    files.push(pkg.main);
  }

  pkg.output.forEach(function(pattern) {
    var items = glob.sync(pattern, {cwd: pkg.dest});
    items = items.filter(function(item) {
      return stat(join(pkg.dest, item)).isFile();
    });
    files = files.concat(items);
  });

  return uniq(files);
};
