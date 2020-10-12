"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function transform(desc, x, transformer, scope) {
    if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
        if (transformer instanceof Function) {
            return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed(desc, function (observer) { return x.subscribe(function (value) { return transformer(value, observer); }); }));
        }
        else {
            return transform(desc, x, transformer.changes, scope);
        }
    }
    var t = transformer;
    if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.AtomSeed) {
        var source_1 = x.consume();
        return applyscope_1.applyScopeMaybe(new abstractions_1.AtomSeed(desc, function () { return t.init(source_1.get()); }, transformPropertySubscribe(source_1, t), function (newValue) { return source_1.set(newValue); }));
    }
    else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
        var source_2 = x.consume();
        return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(desc, function () { return t.init(source_2.get()); }, transformPropertySubscribe(source_2, t)));
    }
    else {
        throw Error("Unknown observable " + x);
    }
}
exports.transform = transform;
function transformPropertySubscribe(src, transformer) {
    if (src === undefined)
        throw Error("Assertion failed");
    return function (observer) { return src.onChange(function (value) { return transformer.changes(value, observer); }); };
}
//# sourceMappingURL=transform.js.map