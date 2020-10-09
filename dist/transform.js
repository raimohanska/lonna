var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
    exports.transform = void 0;
    var abstractions_1 = require("./abstractions");
    var applyscope_1 = require("./applyscope");
    function transform(desc, x, transformer, scope) {
        var seed;
        if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
            seed = new abstractions_1.EventStreamSeed(desc, function (observer) { return seed.forEach(function (value) { return transformer.changes(value, observer); }); });
        }
        else if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.AtomSeed) {
            seed = new abstractions_1.AtomSeed(desc, transformSubscribe(x, transformer), function (newValue) { return x.set(newValue); });
        }
        else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
            seed = new abstractions_1.PropertySeed(desc, transformSubscribe(x, transformer));
        }
        else {
            throw Error("Unknown observable " + x);
        }
        if (scope !== undefined) {
            return applyscope_1.applyScope(scope, seed);
        }
        return seed;
    }
    exports.transform = transform;
    function transformSubscribe(src, transformer) {
        if (src === undefined)
            throw Error("Assertion failed");
        return function (observer) {
            var _a = __read(src.subscribe(function (value) { return transformer.changes(value, observer); }), 2), initial = _a[0], unsub = _a[1];
            return [transformer.init(initial), unsub];
        };
    }
});
//# sourceMappingURL=transform.js.map