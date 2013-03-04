define("test/css/0.1.0/module-debug", [ "./module.css-debug" ], function(require) {
  require("./module.css-debug");
});
define("test/css/0.1.0/module.css-debug", [], function() {
  function importStyle(cssText) {
    var element = document.createElement("style");
    doc.getElementsByTagName("head")[0].appendChild(element);
    if (element.styleSheet) {
      element.styleSheet.cssText = cssText;
    } else {
      element.appendChild(doc.createTextNode(cssText));
    }
  }
  importStyle("body{display:block}");
});
