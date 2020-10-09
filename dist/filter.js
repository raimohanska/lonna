(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./applyscope", "./transform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.filter = void 0;
    var applyscope_1 = require("./applyscope");
    var transform_1 = require("./transform");
    function filter(s, fn, scope) {
        var seed = transform_1.transform(s + ".map(fn)", s, filterT(fn));
        if (scope !== undefined) {
            return applyscope_1.applyScope(scope, seed);
        }
        return seed;
    }
    exports.filter = filter;
    function filterT(fn) {
        return {
            changes: function (value, observer) {
                if (fn(value)) {
                    observer(value);
                }
            },
            init: function (value) {
                if (!fn(value)) {
                    throw Error("Initial value not matching filter");
                }
                return value;
            }
        };
    }
});
//# sourceMappingURL=filter.js.map