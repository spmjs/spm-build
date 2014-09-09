var path = require('path');
var spmrc = require('spmrc');
var grunt = require('spm-grunt');
var getConfig = require('./lib/config').getConfig;

var _cache;

exports = module.exports = function(options) {

  process.on('log.warn', function(msg) {
    grunt.log.warn('warn ' + msg);
  });
  process.on('log.info', function(msg) {
    grunt.log.writeln('info ' + msg);
  });
  _cache = options;

  options = parseOptions(options);

  var pkg = options.pkg;

  // check pkg
  if (!pkg.spm) {
    throw new Error('spm is required in package.json');
  }
  if (!pkg.spm.output) {
    throw new Error('spm.output is required in package.json');
  }

  grunt.invokeTask('build', options, function(grunt) {

    var config = getConfig(options);
    grunt.initConfig(config);
    loadTasks();

    grunt.task.options({'done': function() {
      grunt.log.writeln('success build finished.');
    }});

    grunt.registerInitTask(
      'build', [
        'clean:build', // delete build direcotry first

        'spm-install', // install dependencies

        // build css
        'transport:src',  // src/* -> .build/src/*
        'concat:css',   // .build/src/*.css -> .build/tmp/*.css

        // build js (must be invoke after css build)
        'transport:css',  // .build/tmp/*.css -> .build/src/*.css.js
        'concat:js',  // .build/src/* -> .build/dist/*.js

        // to ./build/dist
        'copy:build',
        'cssmin:css',   // .build/tmp/*.css -> .build/dist/*.css
        'uglify:js',  // .build/tmp/*.js -> .build/dist/*.js

        'clean:dist',
        'copy:dist',  // .build/dist -> dist
        'clean:build',

        'spm-newline'
    ]);
  });
};

Object.defineProperty(exports, 'config', {
  get: function() {
    var options = parseOptions(_cache);
    return getConfig(options);
  }
});

exports.getConfig = getConfig;
exports.parseOptions = parseOptions;

function parseOptions(options) {
  options = options || _cache || {};

  var pkgfile = options.pkgfile || 'package.json';
  var pkg = {};

  if (grunt.file.exists(pkgfile)) {
    pkg = grunt.file.readJSON(pkgfile);
  }
  options.pkg = pkg;

  var installpath = spmrc.get('install.path');
  options.paths = [installpath];
  if (installpath !== 'sea-modules') {
    options.paths.push('sea-modules');
  }
  var globalpath = path.join(spmrc.get('user.home'), '.spm', 'sea-modules');
  options.paths.push(globalpath);

  return options;
}

function loadTasks() {

  // load built-in tasks
  [
    'grunt-cmd-transport',
    'grunt-cmd-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-copy',
    'grunt-contrib-cssmin',
    'grunt-contrib-clean'
  ].forEach(function(task) {
    var taskdir = path.join(__dirname, 'node_modules', task, 'tasks');
    if (grunt.file.exists(taskdir)) {
      grunt.loadTasks(taskdir);
    }
  });

  grunt.loadTasks(path.join(__dirname, 'tasks'));
}

exports.loadTasks = loadTasks;
