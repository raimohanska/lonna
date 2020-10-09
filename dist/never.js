(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./eventstream", "./scope"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.never = void 0;
    var eventstream_1 = require("./eventstream");
    var scope_1 = require("./scope");
    function never() {
        return new eventstream_1.StatefulEventStream("never", scope_1.globalScope);
    }
    exports.never = never;
});
//# sourceMappingURL=never.js.map