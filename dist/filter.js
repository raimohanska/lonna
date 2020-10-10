"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var applyscope_1 = require("./applyscope");
var transform_1 = require("./transform");
function filter(s, fn, scope) {
    return applyscope_1.applyScopeMaybe(transform_1.transform(s + ".map(fn)", s, filterT(fn)), scope);
}
exports.filter = filter;
function filterT(fn) {
    return {
        changes: function (value, observer) {
            if (fn(value)) {
                observer(value);
            }
        },
        init: function (value) {
            if (!fn(value)) {
                throw Error("Initial value not matching filter");
            }
            return value;
        }
    };
}
//# sourceMappingURL=filter.js.map