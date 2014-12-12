'use strict';

var fs = require('fs');
var glob = require('glob');
var rimraf = require('rimraf');
var join = require('path').join;
var sinon = require('sinon');
var log = require('spm-log');

var build = require('../lib/build');

var fixtures = join(__dirname, 'fixtures');
var dest = join(fixtures, 'tmp');

log.info = log.warn = function() {};

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

  it('normal empty idleading', function* () {
    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      idleading: '',
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/normal-empty-idleading'));
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
    var logWarn = sinon.spy(log, 'warn');
    yield *build({
      cwd: join(fixtures, 'multiple-versions'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/multiple-versions'));
    logWarn.callCount.should.be.equal(1);
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

  describe('extra deps', function() {
    afterEach(function() {
      fs.writeFileSync(join(fixtures, 'extra-deps/package.json'),
        '{"name":"a","version":"0.1.0","spm":{}}\n', 'utf-8');
    });

    it('extra deps', function* () {
      yield *build({
        cwd: join(fixtures, 'extra-deps'),
        dest: dest,
        isInstall: false
      });
      assert(dest, join(fixtures, '../expected/extra-deps'));
    });
  });

  it('entry', function* () {
    yield *build({
      cwd: join(fixtures, 'entry'),
      dest: dest,
      isInstall: false,
      entry: ['a.js']
    });
    assert(dest, join(fixtures, '../expected/entry'));
  });

  it('copy img', function* () {
    yield *build({
      cwd: join(fixtures, 'copy-img'),
      dest: dest,
      isInstall: false
    });
    assert(dest, join(fixtures, '../expected/copy-img'));
  });

  it('force', function* () {
    var fakeFile = join(dest, 'a.js');
    fs.mkdirSync(dest);
    fs.writeFileSync(fakeFile);

    yield *build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      isForce: true,
      isInstall: false
    });

    fs.existsSync(fakeFile).should.be.false;
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
