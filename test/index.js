'use strict';

var fs = require('fs');
var glob = require('glob');
var rimraf = require('rimraf');
var join = require('path').join;

var build = require('../lib/');

var fixtures = join(__dirname, 'fixtures');
var dest = join(fixtures, 'tmp');

describe('lib/index.js', function() {

  afterEach(function(done) {
    rimraf(dest, done);
  });

  it('normal', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal'));
  });

});

function assert(actual, expect) {
  glob.sync('**/*', {cwd: actual})
    .forEach(function(file) {
      var filepath = join(actual, file);
      if (fs.statSync(filepath).isFile()) {
        fs.readFileSync(filepath).toString()
          .should.eql(fs.readFileSync(join(expect, file)).toString());
      }
    });
}
