var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

describe('grunt-spm-build', function() {
  var casedir = path.join(__dirname, 'cases');
  var retdir = path.join(__dirname, 'expected');
  var cases = fs.readdirSync(casedir).filter(function(dir) {
    return fs.statSync(path.join(casedir, dir)).isDirectory();
  });
  cases.forEach(function(dir) {
    it('should build ' + dir, function() {
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
              throw fname + ' is not existed.';
            }
            var expectlines = grunt.file.read(fpath).split('\n');
            var retlines = grunt.file.read(output).split('\n');
            var i = 0;
            expectlines.forEach(function(line) {
              line = line.trim();
              var retdata = retlines[i].trim();
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
