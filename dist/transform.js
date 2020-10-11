"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function transform(desc, x, transformer, scope) {
    if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
        return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed(desc, function (observer) { return x.subscribe(function (value) { return transformer.changes(value, observer); }); }));
    }
    else if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.AtomSeed) {
        return applyscope_1.applyScopeMaybe(new abstractions_1.AtomSeed(desc, transformSubscribe(x, transformer), function (newValue) { return x.set(newValue); }));
    }
    else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
        return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(desc, transformSubscribe(x, transformer)));
    }
    else {
        throw Error("Unknown observable " + x);
    }
}
exports.transform = transform;
function transformSubscribe(src, transformer) {
    if (src === undefined)
        throw Error("Assertion failed");
    return function (observer) {
        var _a = __read(src.subscribeWithInitial(function (value) { return transformer.changes(value, observer); }), 2), initial = _a[0], unsub = _a[1];
        return [transformer.init(initial), unsub];
    };
}
//# sourceMappingURL=transform.js.map