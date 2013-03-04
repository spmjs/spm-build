define("test/relative/0.1.0/module-debug", [ "./module-3-debug", "./module-2-debug", "./module-1-debug" ], function(require) {
    require("./module-3-debug");
});
define("test/relative/0.1.0/module-3-debug", [ "./module-2-debug", "./module-1-debug" ], function(require) {
    require("./module-2-debug");
});
define("test/relative/0.1.0/module-2-debug", [ "./module-1-debug" ], function(require) {
    require("./module-1-debug");
});
define("test/relative/0.1.0/module-1-debug", [], {});
