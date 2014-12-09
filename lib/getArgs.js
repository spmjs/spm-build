'use strict';

var join = require('path').join;
var resolve = require('path').resolve;
var exists = require('fs').existsSync;
var readFile = require('fs').readFileSync;
var mixarg = require('mixarg');

var defaults = {
  // from command
  cwd: process.cwd(),
  dest: 'dist',
  isZip: false,
  isForce: false,
  isUmd: false,
  isInstall: true,
  isWithDeps: false,

  // build config
  ignore: '',
  skip: '',
  idleading: '{{name}}/{{version}}',
  include: ''
};

module.exports = function(opt) {
  var cwd = opt.cwd = opt.cwd || process.cwd();
  var file = join(cwd, 'package.json');
  var spm = exists(file) && JSON.parse(readFile(file, 'utf-8')).spm || {};

  var args = mixarg(defaults, spm.buildArgs || '', opt);
  args.dest = resolve(cwd, args.dest);
  if (typeof args.ignore === 'string') args.ignore = args.ignore.split(/\s*,\s*/);
  if (typeof args.skip === 'string') args.skip = args.skip.split(/\s*,\s*/);

  return args;
};
