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
exports.map = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var property_1 = require("./property");
function map(o, x) {
    var desc = o + ".map(fn)";
    var fn = (x instanceof abstractions_1.Property) ? function () { return x.get(); } : x;
    if (o instanceof abstractions_1.EventStream) {
        return new eventstream_1.StatelessEventStream(desc, function (observer) { return o.forEach(function (v) { return observer(fn(v)); }); }, o.scope());
    }
    else if (o instanceof abstractions_1.EventStreamSeed) {
        return new abstractions_1.EventStreamSeed(desc, function (observer) { return o.forEach(function (v) { return observer(fn(v)); }); });
    }
    else if (o instanceof abstractions_1.Property) {
        return new property_1.DerivedProperty(desc, [o], fn);
    }
    else if (o instanceof abstractions_1.PropertySeed) {
        return new abstractions_1.PropertySeed(desc, function (observer) {
            var _a = __read(o.subscribe(function (value) { return observer(fn(value)); }), 2), value = _a[0], unsub = _a[1];
            return [fn(value), unsub];
        });
    }
    throw Error("Unknown observable");
}
exports.map = map;
//# sourceMappingURL=map.js.map