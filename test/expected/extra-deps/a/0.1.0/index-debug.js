define("a/0.1.0/index-debug", ["handlebars-runtime/1.3.0/dist/cjs/handlebars.runtime-debug","import-style/1.0.0/index-debug"], function(require, exports, module){
require("a/0.1.0/a-debug.css.js");
require("a/0.1.0/a-debug.handlebars");
alert(1);

});
define("a/0.1.0/a-debug.css.js", ["import-style/1.0.0/index-debug"], function(require, exports, module){
require("import-style/1.0.0/index-debug")('a{color:red;}');

});
define("a/0.1.0/a-debug.handlebars", ["handlebars-runtime/1.3.0/dist/cjs/handlebars.runtime-debug"], function(require, exports, module){
var Handlebars = require("handlebars-runtime/1.3.0/dist/cjs/handlebars.runtime-debug")["default"];
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });

});
