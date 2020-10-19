"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
var buffer_1 = require("./buffer");
var map_1 = require("./map");
var transformchanges_1 = require("./transformchanges");
function throttle(delay, scope) {
    return transformchanges_1.transformChanges("throttle(" + delay + ")", function (changes) { return map_1.map(function (values) { return values[values.length - 1]; })(buffer_1.bufferWithTime(delay)(changes)); }, scope);
}
exports.throttle = throttle;
//# sourceMappingURL=throttle.js.map