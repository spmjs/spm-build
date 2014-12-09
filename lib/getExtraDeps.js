'use strict';

var extname = require('path').extname;

module.exports = function(files, pkg, depFilesMap) {
  var deps = {};
  files.forEach(function(f) {
    if (extname(f) !== '.js') return;
    var file = (depFilesMap && depFilesMap[f]) || pkg.files[f];
    if (!file) return;
    if (!pkg.dependencies['import-style'] && file.hasExt('css')) {
      deps['import-style'] = true;
    }
    if (!pkg.dependencies['handlebars-runtime'] && file.hasExt('handlebars')) {
      deps['handlebars-runtime'] = true;
    }
  });
  return Object.keys(deps);
};
