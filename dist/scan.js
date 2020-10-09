(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./abstractions", "./applyscope"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.scan = void 0;
    var abstractions_1 = require("./abstractions");
    var applyscope_1 = require("./applyscope");
    function scan(stream, initial, fn, scope) {
        var seed = new abstractions_1.PropertySeed(stream + ".scan(fn)", function (observer) {
            var current = initial;
            var unsub = stream.forEach(function (newValue) {
                current = fn(current, newValue);
                observer(current);
            });
            return [initial, unsub];
        });
        if (scope)
            return applyscope_1.applyScope(scope, seed);
        return seed;
    }
    exports.scan = scan;
});
//# sourceMappingURL=scan.js.map