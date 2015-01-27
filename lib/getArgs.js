'use strict';

var join = require('path').join;
var resolve = require('path').resolve;
var exists = require('fs').existsSync;
var readFile = require('fs').readFileSync;
var mixarg = require('mixarg');
var log = require('spm-log');

var defaults = {
  // from command
  cwd: process.cwd(),
  dest: 'dist',
  zip: false,
  force: false,
  withDeps: false,
  install: true,

  // build config
  ignore: '',
  skip: '',
  idleading: '{{name}}/{{version}}',
  global: '',

  // other
  uglify: {output:{ascii_only:true}},
  cssmin: {},
  entry: [],
  registry: 'http://spmjs.io'
};

module.exports = function(opt) {
  var cwd = opt.cwd = opt.cwd || process.cwd();
  var file = join(cwd, 'package.json');
  var pkg = exists(file) && JSON.parse(readFile(file, 'utf-8')) || {};
  var spm = pkg.spm || {};

  var args = mixarg(defaults, spm.buildArgs || '', spm, opt);
  args.dest = resolve(cwd, args.O || args.dest);

  if (typeof args.ignore === 'string') args.ignore = args.ignore ? args.ignore.split(/\s*,\s*/) : [];
  if (typeof args.skip === 'string') args.skip = args.skip ? args.skip.split(/\s*,\s*/) : [];
  args.global = getGlobal(args.global);
  args.skip = args.skip.concat(Object.keys(args.global));

  if (args.include) {
    log.warn('Deprecated', 'buildArgs.include is deprecated, using sea, standalone and umd instead.');
  }

  if (['self', 'relative', 'all'].indexOf(args.sea) > -1) args.include = args.sea;
  if (args.standalone) args.include = 'standalone';
  if (args.umd === true || args.include === 'umd') {
    args.umd = camelCase(pkg.name);
  }
  if (args.umd) {
    args.include = 'umd';
  }

  return args;
};

function getGlobal(str) {
  if (({}).toString.call(str) === '[object Object]') return str;
  if (typeof str !== 'string') return {};

  var ret = {};
  str.split(/\s*,\s*/).forEach(function(item) {
    var m = item.split(':');
    if (m[1]) {
      ret[m[0]] = m[1].trim();
    }
  });
  return ret;
}

function camelCase(str) {
  return str.replace(/[_.-](\w|$)/g, function (_,x) {
    return x.toUpperCase();
  });
}
