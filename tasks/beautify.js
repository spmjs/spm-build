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

  grunt.registerMultiTask('spm-beautify', 'Beautiful human readable source.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      suffix: '-debug',
      src: '.build/concat',
      dest: 'dist'
    });

    var fname, destfile;
    this.filesSrc.forEach(function(fpath) {
      if (!/\.(js|css)$/.test(fpath)) return;
      fname = fpath.replace(options.src, '').replace(/^\//, '');
      destfile = path.join(options.dest, fname);

      if (/\.js$/.test(fname)) {
        destfile = destfile.replace(/\.js$/, options.suffix + '.js');
        grunt.log.writeln('Beautifying "' + fpath + '" => ' + destfile);

        beautyJS(fpath, destfile, options);
      } else if (/\.css$/.test(fname)) {
        destfile = destfile.replace(/\.css/, options.suffix + '.css');
        grunt.log.writeln('Beautifying "' + fpath + '" => ' + destfile);

        beautyCSS(fpath, destfile, options);
      }
    });

  });

  function beautyJS(fpath, dest, options) {
    var data = grunt.file.read(fpath);
    data = ast.modify(data, function(v) {
      if (/\.js$/.test(v)) {
        return v.replace(/\.js$/, options.suffix + '.js');
      }
      return v + options.suffix;
    });
    var code = ast.getAst(data).print_to_string({
      beautify: true,
      comments: true
    });
    grunt.file.write(dest, code);
  }

  function beautyCSS(fpath, dest) {
    var data = grunt.file.read(fpath);
    grunt.file.write(dest, data);
  }
};
