define(function(require, exports, module) {
  var $ = require('$');
  var sayHello = require('./say-hello');
  $('#say').click(function(e) {
    e.preventDefault();
    sayHello();
  });
});
