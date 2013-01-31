/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

var ast = require('cmd-util').ast;
var path = require('path');


module.exports = function(grunt) {

  grunt.registerMultiTask('spm-js-minify', 'Minify JavaScript.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      suffix: '',
      src: 'dist',
      dest: 'dist',
      uglify: {}
    });

    var fname, destfile;
    this.filesSrc.forEach(function(fpath) {
      if (!/\.js/.test(fpath)) {
        grunt.log.warn(fpath + ' is not js.');
        return;
      }
      fname = fpath.replace(options.src, '').replace(/^\//, '');
      destfile = path.join(options.dest, fname);
      destfile = destfile.replace(/\.js$/, options.suffix + '.js');

      data = grunt.file.read(fpath);
      if (options.suffix) {
        data = ast.modify(data, function(v) {
          if (/\.js$/.test(v)) {
            return v.replace(/\.js$/, options.suffix + '.js');
          }
          return v + options.suffix;
        });
      }
      data = ast.getAst(data).print_to_string(options.uglify);
      grunt.file.write(destfile, data);
    });

  });
};
