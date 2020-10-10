"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateSkippingObserver = exports.nop = void 0;
function nop() { }
exports.nop = nop;
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
//# sourceMappingURL=util.js.map