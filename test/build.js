'use strict';

var fs = require('fs');
var glob = require('glob');
var rimraf = require('rimraf');
var join = require('path').join;
var sinon = require('sinon');
var log = require('spm-log');
var thunkify = require('thunkify');

var Build = require('../lib/build');

var build = thunkify(function(args, done) {
  new Build(args)
    .getArgs()
    .installDeps()
    .parsePkg()
    .addCleanTask()
    .run(done);
});

var fixtures = join(__dirname, 'fixtures');
var dest = join(fixtures, 'tmp');

log.info = log.warn = function() {};

describe('lib/index.js', function() {

  afterEach(function(done) {
    rimraf(dest, done);
  });

  it('normal', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      install: true
    });
    assert(dest, join(fixtures, '../expected/normal'));
  });

  it('normal with `--sea`', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      install: true,
      sea: 'relative'
    });
    assert(dest, join(fixtures, '../expected/normal'));
  });

  it('normal all', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      install: true,
      sea: 'all'
    });
    assert(dest, join(fixtures, '../expected/normal-all'));
  });

  it('normal withDeps', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      withDeps: true,
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-withDeps'));
  });

  it('normal ignore', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      ignore: 'type',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-ignore'));
  });

  it('normal standalone', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      include: 'standalone',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-standalone'));
  });

  it('normal standalone with `--standalone`', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      standalone: true,
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-standalone'));
  });

  it('normal standalone ignore', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      ignore: 'type',
      include: 'standalone',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-standalone-ignore'));
  });

  it('normal umd', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      include: 'umd',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-umd'));
  });

  it('normal empty idleading', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      idleading: '',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-empty-idleading'));
  });

  it('normal global', function* () {
    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      global: 'type: Type',
      install: false
    });
    assert(dest, join(fixtures, '../expected/normal-global'));
  });

  it('nodeps ignore', function* () {
    yield build({
      cwd: join(fixtures, 'nodeps-ignore'),
      dest: dest,
      ignore: 'jquery',
      install: false
    });
    assert(dest, join(fixtures, '../expected/nodeps-ignore'));
  });

  it('multiple versions', function* () {
    var logWarn = sinon.spy(log, 'warn');
    yield build({
      cwd: join(fixtures, 'multiple-versions'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/multiple-versions'));
    logWarn.callCount.should.be.equal(1);
  });

  it('css package', function* () {
    yield build({
      cwd: join(fixtures, 'css-package'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/css-package'));
  });

  it('css resources', function* () {
    yield build({
      cwd: join(fixtures, 'css-resources'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/css-resources'));
  });

  it('package file', function* () {
    yield build({
      cwd: join(fixtures, 'package-file'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/package-file'));
  });

  it('autoprefixer', function* () {
    yield build({
      cwd: join(fixtures, 'autoprefixer'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/autoprefixer'));
  });

  it('to5', function* () {
    yield build({
      cwd: join(fixtures, 'to5'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/to5'));
  });

  describe('extra deps', function() {
    afterEach(function() {
      fs.writeFileSync(join(fixtures, 'extra-deps/package.json'),
        '{"name":"a","version":"0.1.0","spm":{}}\n', 'utf-8');
    });

    it('extra deps', function* () {
      yield build({
        cwd: join(fixtures, 'extra-deps'),
        dest: dest,
        install: false
      });
      assert(dest, join(fixtures, '../expected/extra-deps'));
    });
  });

  it('entry', function* () {
    yield build({
      cwd: join(fixtures, 'entry'),
      dest: dest,
      install: false,
      entry: ['a.js']
    });
    assert(dest, join(fixtures, '../expected/entry'));
  });

  describe('entry without pkg', function() {

    afterEach(function() {
      rimraf.sync(join(fixtures, 'entry-without-pkg/package.json'));
    });

    it('entry without pkg', function* () {
      yield build({
        cwd: join(fixtures, 'entry-without-pkg'),
        dest: dest,
        install: false,
        entry: ['a.js']
      });
      assert(dest, join(fixtures, '../expected/entry-without-pkg'));
    });

    it('output file', function*() {
      yield build({
        cwd: join(fixtures, 'entry-without-pkg'),
        dest: dest,
        install: false,
        entry: ['a.js'],
        outputFile: 'build.js'
      });
      fs.readFileSync(join(fixtures, 'entry-without-pkg/build.js'), 'utf-8').should.be.equal('define("/a",[],function(){console.log("a.js")});');
      rimraf.sync(join(fixtures, 'entry-without-pkg/build.js'));
    });

  });

  it('hash', function* () {
    yield build({
      cwd: join(fixtures, 'hash'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/hash'));
  });

  it('copy img', function* () {
    yield build({
      cwd: join(fixtures, 'copy-img'),
      dest: dest,
      install: false
    });
    assert(dest, join(fixtures, '../expected/copy-img'));
  });

  it('force', function* () {
    var fakeFile = join(dest, 'a.js');
    fs.mkdirSync(dest);
    fs.writeFileSync(fakeFile);

    yield build({
      cwd: join(fixtures, 'normal'),
      dest: dest,
      force: true,
      install: false
    });

    fs.existsSync(fakeFile).should.be.false;
  });

  describe('scripts', function() {

    afterEach(function() {
      rimraf.sync(join(fixtures, 'scripts/index.js'));
    });

    it('with scripts', function* () {
      process.chdir(join(fixtures, 'scripts'));
      yield require('exeq')('node --harmony ' + join(__dirname, '../cli.js'));
      fs.readFileSync(join(fixtures, 'scripts', 'index.js'), 'utf-8').should.be.equal('1\n2\n3\n');
    });

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
