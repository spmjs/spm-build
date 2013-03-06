var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

describe('grunt-spm-build', function() {
  grunt.log.muted = true;
  var casedir = path.join(__dirname, 'cases');
  var retdir = path.join(__dirname, 'expected');
  var cases = fs.readdirSync(casedir).filter(function(dir) {
    return fs.statSync(path.join(casedir, dir)).isDirectory();
  });
  cases.forEach(function(dir) {
    it('should build ' + dir, function() {
      // reset config
      grunt.config.data = {};
      grunt.tasks(
        ['build'],
        {gruntfile: path.join(casedir, dir, 'Gruntfile.js')},
        function() {
          var dist = path.join(casedir, dir, 'dist');
          var expectdir = path.join(retdir, dir);
          grunt.file.recurse(expectdir, function(fpath) {
            var fname = fpath.replace(expectdir, '').replace(/^\//, '');
            var output = path.join(dist, fname);
            if (!grunt.file.exists(output)) {
              throw new Error(fname + ' is not existed.');
            }
            var expectlines = grunt.file.read(fpath).trim().split('\n');
            expectlines = expectlines.filter(function(line) {
              return line;
            });
            var retlines = grunt.file.read(output).trim().split('\n');
            retlines = retlines.filter(function(line) {
              return line;
            });
            var i = 0;
            expectlines.forEach(function(line) {
              line = line.replace(/\s+/g, '');
              var retdata = retlines[i].replace(/\s+/g, '');
              if (line !== retdata) {
                grunt.file.delete(dist);
                throw new Error(
                  '\nExpect:\n' + line + '\n\nGot:\n' + retdata + '\n\n'
                );
              }
              i = i + 1;
            });
          });
          grunt.file.delete(dist);
        }
      );
    });
  });
});
