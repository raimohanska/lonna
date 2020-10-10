"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function flatMap(s, fn, scope) {
    if (s instanceof abstractions_1.EventStream) {
        scope = s.getScope();
    }
    return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed(s + ".flatMap(fn)", function (observer) {
        var children = [];
        var unsubThis = s.forEach(function (value) {
            var child = fn(value);
            children.push(child.forEach(observer));
        });
        return function () {
            unsubThis();
            children.forEach(function (f) { return f(); });
        };
    }));
}
exports.flatMap = flatMap;
//# sourceMappingURL=flatmap.js.map