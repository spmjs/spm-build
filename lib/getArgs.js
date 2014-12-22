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
  O: null,
  zip: false,
  force: false,
  withDeps: false,
  install: true,

  // build config
  ignore: '',
  skip: '',
  idleading: '{{name}}/{{version}}',
  include: '',
  global: '',

  // other
  uglify: {output:{ascii_only:true}},
  cssmin: {}
};

module.exports = function(opt) {
  var cwd = opt.cwd = opt.cwd || process.cwd();
  var file = join(cwd, 'package.json');
  var spm = exists(file) && JSON.parse(readFile(file, 'utf-8')).spm || {};

  var args = mixarg(defaults, spm.buildArgs || '', spm, opt);
  args.dest = resolve(cwd, args.O || args.dest);

  if (typeof args.ignore === 'string') args.ignore = args.ignore ? opt.ignore.split(/\s*,\s*/) : [];
  if (typeof args.skip === 'string') args.skip = args.skip ? args.skip.split(/\s*,\s*/) : [];
  args.global = getGlobal(args.global);
  args.skip = args.skip.concat(Object.keys(args.global));

  return args;
};

function getGlobal(str) {
  if (({}).toString.call(str) === '[object Object]') return str;
  if (typeof str !== 'string') return {};

  var ret = {};
  str.split(/\s*,\s*/).forEach(function(item) {
    var m = item.split(':');
    ret[m[0]] = m[1];
  });
  return ret;
}
