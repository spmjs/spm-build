'use strict';

module.exports = function(files, pkg) {
  var rootPkgName = pkg.name;
  var ret = {};

  files.forEach(function(f) {
    var dup = {};
    var file = pkg.files[f];

    file.lookup(function (fileInfo) {
      var name = fileInfo.pkg.name;
      var version = fileInfo.pkg.version;
      if (name === rootPkgName) return;
      dup[name] = dup[name] || {};
      dup[name][version] = true;
    });

    for (var k in dup) {
      var versions = Object.keys(dup[k]);
      if (versions.length > 1) {
        ret[k] = {versions:versions, file:file};
      }
    }
  });

  return ret;
};
