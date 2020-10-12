"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function merge() {
    var streams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        streams[_i] = arguments[_i];
    }
    var sources = streams.map(function (s) { return s.consume(); });
    var seed = new abstractions_1.EventStreamSeed("merge(" + streams + ")", function (observer) {
        var endCount = 0;
        var unsubs = sources.map(function (s) { return s.subscribe(function (event) {
            if (abstractions_1.isValue(event)) {
                observer(event);
            }
            else {
                endCount++;
                if (endCount === sources.length) {
                    observer(abstractions_1.endEvent);
                }
            }
        }); });
        return function () { return unsubs.forEach(function (f) { return f(); }); };
    });
    if (sources[0] instanceof abstractions_1.EventStream) {
        return applyscope_1.applyScope(sources[0].getScope(), seed);
    }
    return seed;
}
exports.merge = merge;
//# sourceMappingURL=merge.js.map