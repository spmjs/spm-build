/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    'spm-clean': {
      build: ['tmp-transport', 'tmp-concat'],
      dist: ['dist']
    }
  });

  require('grunt-spm-build').init(grunt, {pkg: pkg});

  grunt.loadNpmTasks('grunt-spm-build');

  grunt.registerTask('build', ['spm-build']);
  grunt.registerTask('default', ['spm-clean']);
};
