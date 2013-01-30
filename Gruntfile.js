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
    },

    'spm-concat': {
      options: {
        paths: ["test/sea-modules"]
      },

      relative: {
        options: {
          pkg: 'test/cases/relative/package.json',
          type: 'relative',
          dest: 'tmp-concat/relative'
        },

        files: {
          'module.js': 'tmp-transport/relative/module.js'
        }
      },

      alias: {
        options: {
          pkg: 'test/cases/alias/package.json',
          type: 'all',
          dest: 'tmp-concat/alias'
        },

        files: {
          'module.js': 'tmp-transport/alias/module.js'
        }
      },

      multi: {
        options: {
          type: 'list',
          dest: 'tmp-concat/multi'
        },

        files: {
          'module.js': ['tmp-transport/multi/*.js'],
          'module.css': 'tmp-transport/multi/module.css'
        }
      }
    },

    'spm-beautify': {
      multi: {
        options: {
          src: 'tmp-concat/multi',
          dest: 'tmp-dist/multi'
        },
        src: 'tmp-concat/multi/**/*'
      }
    },

    'spm-css-minify': {
      multi: {
        options: {
          src: 'tmp-concat/multi',
          dest: 'tmp-dist/multi'
        },
        src: 'tmp-concat/multi/**/*.css'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask(
    'test',
    ['spm-transport', 'spm-concat', 'spm-beautify']
  );

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
