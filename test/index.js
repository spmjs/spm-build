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

  it('normal withDeps', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      isWithDeps: true,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-withDeps'));
  });

  it('normal ignore', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      ignore: 'type',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-ignore'));
  });

  it('normal standalone', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      include: 'standalone',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-standalone'));
  });

  it('normal standalone ignore', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      ignore: 'type',
      include: 'standalone',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-standalone-ignore'));
  });

  it('normal umd', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      include: 'umd',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-umd'));
  });

  it('nodeps ignore', function* () {
    yield *build({
      cwd: join(fixtures, 'nodeps-ignore'),
      dest: dest,
      ignore: 'jquery',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/nodeps-ignore'));
  });

  it('multiple versions', function* () {
    yield *build({
      cwd: join(fixtures, 'multiple-versions'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/multiple-versions'));
  });

  it('css package', function* () {
    yield *build({
      cwd: join(fixtures, 'css-package'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/css-package'));
  });

  it('package file', function* () {
    yield *build({
      cwd: join(fixtures, 'package-file'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/package-file'));
  });

  it('extra deps', function* () {
    yield *build({
      cwd: join(fixtures, 'extra-deps'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/extra-deps'));
    fs.writeFileSync(join(fixtures, 'extra-deps/package.json'),
      '{"name":"a","version":"0.1.0","spm":{}}\n', 'utf-8');
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
