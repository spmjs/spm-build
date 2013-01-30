/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  var config = require('grunt-spm-build');
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    clean: {
      transport: ['tmp-transport'],
      concat: ['tmp-concat'],
      dist: ['dist']
    },

    'spm-transport': config.transport(),
    'spm-concat': config.concat({output: pkg.spm.output}),
    'spm-beautify': config.beautify(),
    'spm-css-minify': config.cssminify(),
    'spm-js-minify': config.jsminify()
  });

  grunt.loadNpmTasks('grunt-spm-build');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask(
    'build',
    [
      'spm-transport', 'spm-concat',
      'spm-beautify',
      'spm-css-minify', 'spm-js-minify',
      'clean:transport', 'clean:concat'
    ]
  );

  grunt.registerTask('default', ['clean']);
};
