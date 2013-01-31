var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('spm-clean', 'Clean files and folders.', function() {
    var options = this.options({
      force: false
    });

    // Clean specified files / dirs.
    this.filesSrc.forEach(function(filepath) {
      grunt.log.write('Cleaning "' + filepath + '"...');

      try {
        grunt.file.delete(filepath, options);
        grunt.log.ok();
      } catch (e) {
        grunt.log.error();
        grunt.verbose.error(e);
        grunt.fail.warn('Clean operation failed.');
      }
    });
  });

  grunt.registerMultiTask('spm-copy', 'Copy files and folders.', function() {
    var options = this.options({
      force: true,
      dest: 'dist'
    });

    this.files.forEach(function(fileObj) {
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      files.map(function(src) {
        try {
          copy(src, path.join(options.dest, fileObj.dest));
          grunt.log.ok();
        } catch (e) {
          grunt.log.error();
          grunt.verbose.error(e);
          grunt.fail.warn('Copy operation failed.');
        }
      });
    });
  });

  function copy(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      grunt.file.recurse(src, function(fpath) {
        var fname = fpath.replace(src, '').replace(/^\//, '');
        grunt.file.copy(fpath, path.join(dest, fname));
      });
    } else {
      grunt.file.copy(src, dest);
    }
  }
};
