'use strict';

var spmrc = require('spmrc');
var getFiles = require('./getFiles');

module.exports = function(pkg) {
  var filesMap = {};
  var files = [];

  var depPkgs = getAllDependencies(pkg);
  for (var id in depPkgs) {
    var depPkg = depPkgs[id];
    getFiles(depPkg).forEach(function(f) {
      var filepath = spmrc.get('install.path') + '/' + id.replace('@','/') + '/' + f;
      filesMap[filepath] = depPkg.files[f];
      files.push(filepath);
    });
  }

  return {
    files: files,
    filesMap: filesMap
  };
};

function getAllDependencies(pkg) {
  var result = {};
  recurseDependencies(pkg);
  return result;

  function recurseDependencies(pkg) {
    Object.keys(pkg.dependencies).forEach(function(key) {
      var id = pkg.dependencies[key].id;
      if (!result[id]) {
        result[id] = pkg.dependencies[key];
        recurseDependencies(pkg.dependencies[key]);
      }
    });
  }
}
