"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
var buffer_1 = require("./buffer");
var map_1 = require("./map");
var transformchanges_1 = require("./transformchanges");
function throttle(s, delay, scope) {
    return transformchanges_1.transformChanges(s + (".throttle(" + delay + ")"), s, function (changes) { return map_1.map(buffer_1.bufferWithTime(changes, delay), function (values) { return values[values.length - 1]; }); });
}
exports.throttle = throttle;
//# sourceMappingURL=throttle.js.map