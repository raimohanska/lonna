(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.duplicateSkippingObserver = void 0;
    function duplicateSkippingObserver(initial, observer) {
        var current = initial;
        return function (newValue) {
            if (newValue !== current) {
                current = newValue;
                observer(newValue);
            }
        };
    }
    exports.duplicateSkippingObserver = duplicateSkippingObserver;
});
//# sourceMappingURL=util.js.map