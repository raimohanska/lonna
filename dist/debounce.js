"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
var flatmaplatest_1 = require("./flatmaplatest");
var later_1 = require("./later");
var transformchanges_1 = require("./transformchanges");
function debounce(delay, scope) {
    return transformchanges_1.transformChanges("debounce(" + delay + ")", function (changes) { return flatmaplatest_1.flatMapLatest(function (value) { return later_1.later(delay, value); })(changes); }, scope);
}
exports.debounce = debounce;
//# sourceMappingURL=debounce.js.map