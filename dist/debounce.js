"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
var applyscope_1 = require("./applyscope");
var flatmaplatest_1 = require("./flatmaplatest");
var later_1 = require("./later");
var transformchanges_1 = require("./transformchanges");
function debounce(s, delay, scope) {
    return applyscope_1.applyScopeMaybe(transformchanges_1.transformChanges(s + (".debounce(" + delay + ")"), s, function (changes) { return flatmaplatest_1.flatMapLatest(changes, function (value) { return later_1.later(delay, value); }); }), scope);
}
exports.debounce = debounce;
//# sourceMappingURL=debounce.js.map