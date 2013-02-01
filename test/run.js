var fs = require('fs');
var grunt = require('grunt');

describe('grunt-spm-build', function() {
  var basedir = __dirname + '/cases/';
  var cases = fs.readdirSync(basedir).filter(function(dir) {
    return fs.statSync(basedir + dir).isDirectory();
  });
  cases.forEach(function(dir) {
    it('should build ' + dir, function() {
      grunt.tasks(
        ['build'],
        {gruntfile: basedir + dir + '/Gruntfile.js'},
        function() {}
      );
    });
  });
});
