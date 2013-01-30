/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

var path = require('path');


module.exports = function(grunt) {

  grunt.registerMultiTask('spm-concat', 'Concat module to one file.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      paths: ['sea-modules'],
      type: 'list',
      dest: 'tmp-concat'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj) {
      // The source files to be concatenated. The "nonull" option is used
      // to retain invalid files/patterns so they can be warned about.
      var files = grunt.file.expand({nonull: true}, fileObj.src);

      var data;
      if (options.type === 'relative') {

      } else if (options.type === 'all') {

      } else {
        // Concat specified files.
        data = files.map(function(filepath) {
          // Warn if a source file/pattern was invalid.
          if (!grunt.file.exists(filepath)) {
            grunt.log.error('Source file "' + filepath + '" not found.');
            return '';
          }
          return grunt.file.read(filepath);
        }).join('\n\n');
      }

      // Write the destination file.
      grunt.file.write(path.join(options.dest, fileObj.dest), data);

      // Print a success message.
      grunt.log.verbose.ok('Concat "' + files +  '" to "' + fileObj.dest + '".');
    });
  });

};
