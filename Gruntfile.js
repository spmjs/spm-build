/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  var candy = require('./');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'index.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    }
  });

  candy.initConfig(grunt, {
    paths: ['test/fixtures/sea-modules'],
    source: 'test/fixtures/src',
    pkg: 'test/fixtures/package.json'
  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');

  grunt.registerTask('build', ['spm-build']);

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);
};
