module.exports = function(grunt) {
  var path = require('path');

  // register spm install tasks
  grunt.registerTask('spm-install', function() {
    var done = this.async();
    try {
      var spm = require('spm');
      spm.install({query: []}, done);
    } catch (e) {
      grunt.log.warn('spm ' + e.message || e);
      done();
    }
  });

  grunt.registerTask('spm-newline', function() {
    grunt.file.recurse('dist', function(f) {
      grunt.log.writeln('create ' + f);
      var extname = path.extname(f);
      if (extname === '.js' || extname === '.css') {
        var text = grunt.file.read(f);
        if (!/\n$/.test(text)) {
          grunt.file.write(f, text + '\n');
        }
      }
    });
  });
};
