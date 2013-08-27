module.exports = function(grunt) {
  var path = require('path');

  // register spm install tasks
  grunt.registerTask('spm-install', function() {
    var done = this.async();
    var options = this.options({
      force: false
    });

    var spm;
    try {
      spm = require('spm');
    } catch (e) {
      grunt.log.warn('spm ' + e.message || e);
    }

    if (spm) {
      spm.install({
        query: [],
        force: options.force
      }, function(err) {
        if (err) {
          console.log();
          grunt.fail.warn(err);
        }
        done();
      });
    } else {
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
