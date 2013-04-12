var path = require('path');
var spmrc = require('spmrc');
var grunt = require('spm-grunt');
var getConfig = require('./lib/config').getConfig;

exports = module.exports = function(options) {

  process.on('log.warn', function(msg) {
    grunt.log.warn('warn ' + msg);
  });
  process.on('log.info', function(msg) {
    grunt.log.writeln('info ' + msg);
  });

  options = parseOptions(options)

  var scripts = options.pkg.scripts || {};
  if (scripts.build) {
    childexec(scripts.build, function() {
      grunt.log.writeln('success build finished.');
    });
  } else {
    grunt.invokeTask('build', options, function(grunt) {

      var config = getConfig(options);
      grunt.initConfig(config);
      loadTasks();

      grunt.task.options({'done': function() {
        grunt.log.writeln('success build finished.');
      }});

      grunt.registerInitTask(
        'build', [
          'clean:dist', // delete dist direcotry first

          'spm-install', // install dependencies

          // build css
          'transport:spm',  // src/* -> .build/src/*
          'concat:css',   // .build/src/*.css -> .build/dist/*.css

          // build js (must be invoke after css build)
          'transport:css',  // .build/dist/*.css -> .build/src/*.css.js
          'concat:js',  // .build/src/* -> .build/dist/*.js

          // to dist
          'copy:spm',
          'cssmin:css',   // .build/dist/*.css -> dist/*.css
          'uglify:js',  // .build/dist/*.js -> dist/*.js

          'clean:spm',
          'newline'
      ]);

    });
  }
};

Object.defineProperty(exports, 'config', {
  get: function() {
    var options = parseOptions();
    return getConfig(options)
  }
});
exports.getConfig = getConfig;

function parseOptions(options) {
  options = options || {};

  var pkgfile = options.pkgfile || 'package.json';
  var pkg = {};

  if (grunt.file.exists(pkgfile)) {
    pkg = grunt.file.readJSON('package.json');
  }
  options.pkg = pkg;

  var installpath = spmrc.get('install.path');
  options.paths = [installpath];
  if (installpath !== 'sea-modules') {
    options.paths.push('sea-modules');
  }
  var globalpath = path.join(spmrc.get('user.home'), '.spm', 'sea-modules');
  options.paths.push(globalpath);

  options.src = options.inputDirectory || 'src';
  options.dest = options.outputDirectory || 'dist';
  return options;
};

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

  // register spm install tasks
  grunt.registerTask('spm-install', function() {
    var done = this.async();
    try {
      var spm = require('spm');
      spm.install({query: []}, done);
    } catch (e) {
      grunt.log.warn('spm ' + e.message || e);
    }
  });

  grunt.registerTask('newline', function() {
    grunt.file.recurse('dist', function(f) {
      var extname = path.extname(f);
      if (extname === '.js' || extname === '.css') {
        var text = grunt.file.read(f);
        if (!/\n$/.test(text)) {
          grunt.file.write(f, text + '\n');
        }
      }
    });
  });
}
exports.loadTasks = loadTasks;
