'use strict';

var join = require('path').join;
var exists = require('fs').existsSync;
var uniq = require('uniq');
var glob = require('glob');

module.exports = function(pkg) {
  var files = [];

  if (exists(join(pkg.dest, pkg.main))) {
    files.push(pkg.main);
  }

  pkg.output.forEach(function(pattern) {
    var items = glob.sync(pattern, {cwd: pkg.dest});
    files = files.concat(items);
  });

  return uniq(files);
};
