;(function() {
var type_010_index_debug, a_010_a_debug;
type_010_index_debug = function () {
  console.log('type');
}();
a_010_a_debug = function () {
  type_010_index_debug;
  console.log('a@0.1.0');
}();

if (typeof exports == "object") {
  module.exports = a_010_a_debug;
} else if (typeof define == "function" && (define.cmd || define.amd)) {
  define(function(){ return a_010_a_debug });
} else {
  this["a"] = a_010_a_debug;
}
}());