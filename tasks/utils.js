
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
      try {
        grunt.file.copy(fileObj.src, fileObj.dest);
        grunt.log.ok();
      } catch (e) {
        grunt.log.error();
        grunt.verbose.error(e);
        grunt.fail.warn('Copy operation failed.');
      }
    });
  });
};
