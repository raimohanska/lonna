"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMapLatest = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var flatmap_1 = require("./flatmap");
function flatMapLatest(fn, scope) {
    return function (s) {
        if (s instanceof abstractions_1.Property || s instanceof abstractions_1.PropertySeed) {
            return applyscope_1.applyScopeMaybe(new flatmap_1.FlatMapPropertySeed(s + ".flatMapLatest(fn)", s, fn, { latest: true }), scope);
        }
        else {
            return applyscope_1.applyScopeMaybe(new flatmap_1.FlatMapStreamSeed(s + ".flatMapLatest(fn)", s, fn, { latest: true }), scope);
        }
    };
}
exports.flatMapLatest = flatMapLatest;
//# sourceMappingURL=flatmaplatest.js.map