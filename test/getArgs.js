'use strict';

var join = require('path').join;
var getArgs = require('../lib/getArgs');

var fixtures = join(__dirname, 'fixtures');

describe('lib/getArgs.js', function() {

  it('normal', function() {
    var args = getArgs({cwd:join(fixtures, 'get-args')});
    args.uglify.should.be.equal(1);
    args.cssmin.should.be.equal(2);
  });

});
