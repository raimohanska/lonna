(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./abstractions", "./eventstream"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.merge = void 0;
    var abstractions_1 = require("./abstractions");
    var eventstream_1 = require("./eventstream");
    function merge() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        var seed = new abstractions_1.EventStreamSeed("merge(" + streams + ")", function (observer) {
            var unsubs = streams.map(function (s) { return s.forEach(observer); });
            return function () { return unsubs.forEach(function (f) { return f(); }); };
        });
        if (streams[0] instanceof abstractions_1.EventStream) {
            return new eventstream_1.StatelessEventStream(seed, streams[0].scope);
        }
        return seed;
    }
    exports.merge = merge;
});
//# sourceMappingURL=merge.js.map