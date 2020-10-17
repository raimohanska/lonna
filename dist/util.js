"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = exports.remove = exports.nop = exports.duplicateSkippingObserver = void 0;
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
function rename(desc, observable) {
    observable.desc = desc;
    return observable;
}
exports.rename = rename;
__exportStar(require("./tostring"), exports);
//# sourceMappingURL=util.js.map