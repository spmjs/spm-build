'use strict';

require('colorful').colorful();

var debug = require('debug')('spm-build');
var relative = require('path').relative;
var join = require('path').join;
var client = require('spm-client');
var vfs = require('vinyl-fs');
var Package = require('father').SpmPackage;
var rimraf = require('rimraf');
var pipe = require('multipipe');
var log = require('spm-log');
var spmrc = require('spmrc');
var extend = require('extend');
var flatten = require('flatten');
var cdeps = require('cdeps');
var Step = require('step.js');
var thunkify = require('thunkify');
var unyield = require('unyield');

var _if = require('gulp-if');
var mirror = require('gulp-mirror');
var spm = require('gulp-spm');
var size = require('gulp-size2');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var zip = require('gulp-zip');

var logArgs = require('./logArgs');
var getArgs = require('./getArgs');
var getFiles = require('./getFiles');
var getDepFiles = require('./getDepFiles');
var getExtraDeps = require('./getExtraDeps');
var getDuplicate = require('./getDuplicate');
var generatePackageJSON = require('./generatePackageJSON');
var utils = require('./utils');

module.exports = Build;

function Build(opt) {
  if (!(this instanceof Build)) return new Build(opt);
  this.opt = opt || {};
  this.plugins = new Step();
  this.plugins.run = thunkify(this.plugins.run);
  this.fns = this.plugins.fns;
}

/**
 * Add plugin.
 */
Build.prototype.use = function(fn) {
  if (this.plugins.fns.indexOf(fn) > -1) return this;
  var name = fn.name || '(anonymous)';
  debug('using plugin: %s', name);
  this.plugins.use(fn);
  return this;
};

/**
 * Start build.
 */
Build.prototype.run = unyield(function *() {
  // Run Plugins.
  debug('plugins start');
  yield this.plugins.run.call(this);
  debug('plugins end');

  var files = this.files;
  var args = this.args;

  // Stream Build
  yield function(cb) {
    pipe(
      vfs.src(files, {cwd: args.cwd, cwdbase: true}),

      mirror(
        pipe(
          // Transform
          spm(args),
          // Compress
          _if(utils.isJs, uglify(args.uglify)),
          _if(utils.isCSS, cssmin(args.cssmin)),
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
      ),

      // Output files
      vfs.dest(args.dest).on('data', function(file) {
        log.info('generate file', relative(args.cwd, file.path));
      }),

      // Zip files
      _if(args.zip, pipe(zip('archive.zip'), vfs.dest(args.dest)))
    )
      .once('error', cb)
      .once('end', cb)
      .resume();
  };
});

var Plugins = {

  /**
   * Merge args from arguments and spm.buildArgs in package.json.
   */
  getArgs: function() {
    this.args = getArgs(this.opt);
    logArgs(this.args);

    // Try to generate package.json if entry is supplied
    if (this.args.entry.length) {
      generatePackageJSON(this.args);
    }
  },

  /**
   * Install deps.
   */
  installDeps: function* () {
    var args = this.args;
    if (args.entry.length) {
      var deps = flatten(args.entry.map(function(item) {
        return cdeps(join(args.cwd, item));
      }));
      log.info('entry deps', deps.join(', '));
      yield* client.install({cwd:args.cwd, registry:args.registry, name:deps, save:true});
    } else if (args.install) {
      yield* client.install({cwd:args.cwd, registry:args.registry});
    }
  },

  /**
   * Parse pkg, files and dep files.
   */
  parsePkg: function* () {
    var args = this.args;

    // Parse pkg
    var pkg = new Package(args.cwd, {
      ignore: args.ignore,
      skip: args.skip,
      moduleDir: spmrc.get('install.path'),
      entry: args.entry
    });
    args.pkg = pkg;
    log.info('package', 'analyse infomation');
    log.info('package', 'dependencies: ' + Object.keys(pkg.dependencies));
    log.info('package', 'files: ' + Object.keys(pkg.files));

    // Get files to build
    var files = args.entry.length ? args.entry : getFiles(pkg);
    log.info('output', 'files: ' + files);

    // Check duplicate
    var dups = getDuplicate(files, pkg);
    for (var k in dups) {
      log.warn('duplicate', '%s (%s) while build %s'.to.yellow.color,
        k, dups[k].versions, dups[k].file.path);
    }

    // Include files in dependent packages
    var depFilesMap;
    if (args.withDeps) {
      var dep = getDepFiles(pkg);
      files = files.concat(dep.files);
      depFilesMap = dep.filesMap;
      log.info('withDeps', 'files: ' + files);
    }

    this.files = files;
    this.depFilesMap = depFilesMap;

    // Get extra deps
    if (!arguments[0]) {
      var extraDeps = getExtraDeps(this.files, args.pkg, this.depFilesMap);
      log.info('extra deps', extraDeps.length ? extraDeps.join(',') : 'no');
      if (extraDeps && extraDeps.length) {
        log.info('extra deps', 'install extra deps');
        yield* client.install({
          cwd: args.cwd,
          registry: args.registry,
          save: true,
          name: extraDeps
        });

        // Call self to parse again
        yield* Plugins.parsePkg.call(this, true);
      }
    }
  },

  /**
   * Add clean task before build.
   */
  addCleanTask: function() {
    var args = this.args;

    // Clean dest folder
    if (args.force) {
      rimraf.sync(args.dest);
    }
  }
};

// Map plugins to proto
Object.keys(Plugins).forEach(function(name) {
  Build.prototype[name] = function() {
    return this.use(Plugins[name]);
  };
});