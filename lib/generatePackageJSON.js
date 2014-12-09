'use strict';

var join = require('path').join;
var basename = require('path').basename;
var exists = require('fs').existsSync;
var writeFile = require('fs').writeFileSync;

module.exports = function(opt) {
  var file = join(opt.cwd, 'package.json');
  if (exists(file)) {
    return;
  }

  var pkg = {
    name: basename(opt.cwd),
    version: '0.1.0',
    spm: {}
  };
  writeFile(file, JSON.stringify(pkg, null, 2));
};
