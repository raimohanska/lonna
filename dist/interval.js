(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./applyscope", "."], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.interval = void 0;
    var applyscope_1 = require("./applyscope");
    var _1 = require(".");
    function interval(delay, value, scope) {
        var seed = new _1.EventStreamSeed("interval(" + delay + ", " + value + ")", function (observer) {
            var interval = setInterval(function () { return observer(value); }, delay);
            return function () { return clearInterval(interval); };
        });
        if (scope !== undefined) {
            return applyscope_1.applyScope(scope, seed);
        }
        return seed;
    }
    exports.interval = interval;
});
//# sourceMappingURL=interval.js.map