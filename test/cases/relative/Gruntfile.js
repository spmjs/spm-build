/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      transport: ['tmp-transport'],
      concat: ['tmp-concat'],
      dist: ['dist']
    }
  });

  var pkg = grunt.file.readJSON('package.json');
  var spmBuild = require('grunt-spm-build');
  spmBuild.init(grunt, {pkg: pkg});

  grunt.loadNpmTasks('grunt-spm-build');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['spm-build', 'clean:transport', 'clean:concat']);

  grunt.registerTask('default', ['clean']);
};
