"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.and = exports.or = void 0;
var combine_1 = require("./combine");
var map_1 = require("./map");
function or(left, right) {
    return combine_1.combine(left, right, function (x, y) { return x || y; });
}
exports.or = or;
function and(left, right) {
    return combine_1.combine(left, right, function (x, y) { return x && y; });
}
exports.and = and;
function not(prop) {
    return map_1.map(function (x) { return !x; })(prop);
}
exports.not = not;
//# sourceMappingURL=boolean.js.map