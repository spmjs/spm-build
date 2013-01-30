/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    'spm-transport': {
      options: {
        paths: ["test/sea-modules"]
      },
      relative: {
        options: {
          pkg: 'test/cases/relative/package.json',
          src: 'test/cases/relative/src',
          dest: 'tmp-transport/relative'
        },
        src: ["test/cases/relative/src/*.js"]
      },
      alias: {
        options: {
          pkg: 'test/cases/alias/package.json',
          src: 'test/cases/alias/src',
          dest: 'tmp-transport/alias'
        },
        src: ["test/cases/alias/src/*.js"]
      },
      multi: {
        options: {
          pkg: 'test/cases/multi/package.json',
          src: 'test/cases/multi/src',
          dest: 'tmp-transport/multi'
        },
        src: ["test/cases/multi/src/*"]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['spm-transport']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
