var join = require('path').join;
var resolve = require('path').resolve;
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
  var pkg = require(join(cwd, 'package.json'));
  var spm = pkg.spm || {};

  var args = mixarg(defaults, spm.buildArgs || '', opt);
  args.dest = resolve(args.dest);
  args.ignore = args.ignore.split(/\s*,\s*/);
  args.skip = args.skip.split(/\s*,\s*/);

  return args;
};
