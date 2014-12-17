'use strict';

var join = require('path').join;
var getFiles = require('../lib/getFiles');
var Package = require('father').SpmPackage;

var fixtures = join(__dirname, 'fixtures');

describe('lib/getFiles.js', function() {

  it('normal', function() {
    var pkg = new Package(join(fixtures, 'get-files'));
    var files = getFiles(pkg);
    files.should.be.eql([
      'src/index/index.css',
      'src/index/index.html',
      'src/index/index.js'
    ]);
  });

});
