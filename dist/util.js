"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.nop = exports.duplicateSkippingObserver = void 0;
var abstractions_1 = require("./abstractions");
function duplicateSkippingObserver(initial, observer) {
    var current = initial;
    return function (event) {
        if (abstractions_1.isValue(event)) {
            if (event.value !== current) {
                current = event.value;
                observer(event);
            }
        }
        else {
            observer(event);
        }
    };
}
exports.duplicateSkippingObserver = duplicateSkippingObserver;
function nop() {
}
exports.nop = nop;
function remove(xs, x) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) {
            xs.splice(i, 1);
            return;
        }
    }
}
exports.remove = remove;
//# sourceMappingURL=util.js.map