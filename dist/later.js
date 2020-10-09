"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.later = void 0;
var applyscope_1 = require("./applyscope");
var _1 = require(".");
function later(delay, value, scope) {
    var seed = new _1.EventStreamSeed("interval(" + delay + ", " + value + ")", function (observer) {
        var timeout = setTimeout(function () { return observer(value); }, delay);
        return function () { return clearTimeout(timeout); };
    });
    if (scope !== undefined) {
        return applyscope_1.applyScope(scope, seed);
    }
    return seed;
}
exports.later = later;
//# sourceMappingURL=later.js.map