/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */


var path = require('path');
var cleancss = require('clean-css');


module.exports = function(grunt) {

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

      data = grunt.file.read(fpath);
      data = cleancss.process(data, options.cleancss);
      grunt.file.write(destfile, data);
    });

  });
};
