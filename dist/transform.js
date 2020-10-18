"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function transform(desc, transformer, scope) {
    return function (x) {
        if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
            var transformFn_1 = (transformer instanceof Function) ? transformer : transformer.changes;
            var source_1 = x.consume();
            return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed(desc, function (observer) { return source_1.subscribe(function (value) { return transformFn_1(value, observer); }); }));
        }
        var t = transformer;
        if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.AtomSeed) {
            var source_2 = x.consume();
            return applyscope_1.applyScopeMaybe(new abstractions_1.AtomSeed(desc, function () { return t.init(source_2.get()); }, transformPropertySubscribe(source_2, t), function (newValue) { return source_2.set(newValue); }));
        }
        else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
            var source_3 = x.consume();
            return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(desc, function () { return t.init(source_3.get()); }, transformPropertySubscribe(source_3, t)));
        }
        else {
            throw Error("Unknown observable " + x);
        }
    };
}
exports.transform = transform;
function transformPropertySubscribe(src, transformer) {
    if (src === undefined)
        throw Error("Assertion failed");
    return function (observer) { return src.onChange(function (value) { return transformer.changes(value, observer); }); };
}
//# sourceMappingURL=transform.js.map