/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

var path = require('path');
var uglify = require('uglify-js');
var ast = require('cmd-util').ast;
var cleancss = require('clean-css');


module.exports = function(grunt) {

  grunt.registerMultiTask('spm-js-minify', 'Minify JavaScript.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      suffix: '',
      src: 'tmp-concat',
      dest: 'dist',
      reserved: [],
      uglify: {
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        unsafe: false,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        cascade: true,
        side_effects: true,
        warnings: true
      }
    });

    var fname, destfile, data;
    this.filesSrc.forEach(function(fpath) {
      if (!/\.js/.test(fpath)) {
        grunt.log.warn(fpath + ' is not js.');
        return;
      }

      fname = fpath.replace(options.src, '').replace(/^\//, '');
      destfile = path.join(options.dest, fname);
      destfile = destfile.replace(/\.js$/, options.suffix + '.js');

      grunt.log.writeln('Minifying "' + fpath + '" => ' + destfile);

      data = grunt.file.read(fpath);
      if (options.suffix) {
        data = ast.modify(data, function(v) {
          if (/\.js$/.test(v)) {
            return v.replace(/\.js$/, options.suffix + '.js');
          }
          return v + options.suffix;
        });
      }
      var astCache = uglify.parse(data, {filename: fpath});

      astCache.figure_out_scope();
      var compressor = uglify.Compressor(options.uglify);

      // rewrite warn function
      compressor.warn = function() {
        var msg = uglify.string_template.apply(this, arguments);
        grunt.log.warn(msg);
      };

      astCache = astCache.transform(compressor);

      astCache.figure_out_scope();
      astCache.mangle_names({except: options.reserved});

      data = astCache.print_to_string();
      grunt.file.write(destfile, data);
    });

  });

  grunt.registerMultiTask('spm-css-minify', 'Minify CSS.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      suffix: '',
      src: 'tmp-concat',
      dest: 'dist',
      cleancss: {}
    });

    var fname, destfile, data;
    this.filesSrc.forEach(function(fpath) {
      if (!/\.css$/.test(fpath)) {
        grunt.log.warn(fpath + ' is not css.');
        return;
      }
      fname = fpath.replace(options.src, '').replace(/^\//, '');
      destfile = path.join(options.dest, fname);
      destfile = destfile.replace(/\.css$/, options.suffix + '.css');

      grunt.log.writeln('Minifying "' + fpath + '" => ' + destfile);

      data = grunt.file.read(fpath);
      data = cleancss.process(data, options.cleancss);
      grunt.file.write(destfile, data);
    });

  });

};
