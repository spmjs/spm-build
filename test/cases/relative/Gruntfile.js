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
    clean: {
      transport: ['tmp-transport'],
      concat: ['tmp-concat'],
      dist: ['dist']
    },

    // Before generating any new files, remove any previously-created files.
    'spm-transport': {
      all: {
        options: {
          src: 'src',
          dest: 'tmp-transport'
        },
        src: ["src/**/*"]
      }
    },

    'spm-concat': {
      all: {
        options: {
          type: 'relative',
          dest: 'tmp-concat'
        },

        files: {
          'module.js': 'tmp-transport/module.js'
        }
      }
    },

    'spm-beautify': {
      all: {
        options: {
          src: 'tmp-concat',
          dest: 'dist'
        },
        src: 'tmp-concat/**/*'
      }
    },

    'spm-css-minify': {
      all: {
        options: {
          src: 'tmp-concat',
          dest: 'dist'
        },
        src: 'tmp-concat/**/*.css'
      }
    },

    'spm-js-minify': {
      all: {
        options: {
          src: 'tmp-concat',
          dest: 'dist'
        },
        src: 'tmp-concat/**/*.js'
      }
    }

  });

  // These plugins provide necessary tasks.
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

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean']);
};
