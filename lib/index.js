'use strict';

require('colorful').colorful();

var extname = require('path').extname;
var client = require('spm-client');
var vfs = require('vinyl-fs');
var Package = require('father').SpmPackage;
var rimraf = require('rimraf');
var pipe = require('multipipe');
var log = require('spm-log');
var spmrc = require('spmrc');
var extend = require('extend');

var _if = require('gulp-if');
var mirror = require('gulp-mirror');
var spm = require('gulp-spm');
var size = require('gulp-size2');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var zip = require('gulp-zip');

var getArgs = require('./getArgs');
var getFiles = require('./getFiles');
var getDepFiles = require('./getDepFiles');
var getExtraDeps = require('./getExtraDeps');

module.exports = function* build(opt) {
  var isFirst = opt.isFirstTime != false;
  var args = getArgs(opt);
  logArgs(args);

  // Install dependencies
  if (args.isInstall) {
    yield* client.install({cwd:args.cwd, registry:args.registry});
  }

  // Parse package
  var pkg = new Package(args.cwd, {
    ignore: args.ignore,
    skip: args.skip,
    moduleDir: spmrc.get('install.path')
  });
  log.info('package', 'analyse infomation');
  log.info('package', 'dependencies: ' + Object.keys(pkg.dependencies));
  log.info('package', 'files: ' + Object.keys(pkg.files));

  // Clean dest folder
  if (args.isForce) {
    rimraf.sync(args.dest);
  }

  // Get files to build
  var files = getFiles(pkg);
  log.info('output', 'files: ' + files);

  // Include files in depenent packages
  var depFilesMap;
  if (args.isWithDeps) {
    var dep = getDepFiles(pkg);
    files = files.concat(dep.files);
    depFilesMap = dep.filesMap;
    log.info('withDeps', 'files: ' + files);
  }

  // Get extra deps
  if (isFirst) {
    var extraDeps = getExtraDeps(files, pkg, depFilesMap);
    log.info('extraDeps', extraDeps.join(','));
    if (extraDeps && extraDeps.length) {
      log.info('extraDeps', 'install extra deps');
      yield* client.install({
        cwd: args.cwd,
        registry: args.registry,
        save: true,
        name: extraDeps
      });
      yield* build(extend(args, {isFirstTime:false,isInstall:false}));
      return;
    }
  }

  // Build with stream
  yield buildThunk();

  function buildThunk() {
    return function(cb) {
      pipe(
        vfs.src(files, {cwd: args.cwd, cwdbase: true}),

        _if(willTransport, mirror(
          pipe(
            // Transform
            spm(args),
            // Compress
            _if(isJs, uglify({output:{ascii_only:true}}), cssmin()),
            // Count size
            size({gzip:true, showFiles:true, log:function(title, what, size) {
              size = ((size/1024.0).toFixed(2) + 'kB').to.magenta;
              log.info('size', what + ' ' + size + ' (gzipped)'.to.gray);
            }})
          ),

          // debug version
          pipe(
            spm(extend({}, args, {rename: {suffix: '-debug'}}))
          )
        ), spm.plugin.dest(args)),

        // Output files
        vfs.dest(args.dest).on('data', function(file) {
          log.info('generate file', file.path);
        }),

        // Zip files
        _if(args.isZip, pipe(zip('archive.zip'), vfs.dest(args.dest)))
      )
        .once('error', cb)
        .once('end', cb)
        .resume();
    };

    function willTransport(file) {
      return /^\.(css|js)$/.test(extname(file.path));
    }

    function isJs(file) {
      return extname(file.path) === '.js';
    }
  }
};

function logArgs(args) {
  Object.keys(args)
    .forEach(function(key) {
      log.info('arguments', key + ' = ' + args[key]);
    });
}
