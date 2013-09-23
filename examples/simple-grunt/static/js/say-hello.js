define(function(require, exports, module) {
  var $ = require('$');

  module.exports = function() {
    $('<p>hello world</p>').appendTo('#console');
  };
});
