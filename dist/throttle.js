"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
var applyscope_1 = require("./applyscope");
var buffer_1 = require("./buffer");
var map_1 = require("./map");
var transformchanges_1 = require("./transformchanges");
function throttle(delay, scope) {
    return function (s) { return applyscope_1.applyScopeMaybe(transformchanges_1.transformChanges(s + (".throttle(" + delay + ")"), s, function (changes) { return map_1.map(function (values) { return values[values.length - 1]; })(buffer_1.bufferWithTime(delay)(changes)); }), scope); };
}
exports.throttle = throttle;
//# sourceMappingURL=throttle.js.map