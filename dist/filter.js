"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var transform_1 = require("./transform");
function filter(s, fn, scope) {
    return applyscope_1.applyScopeMaybe(transform_1.transform(s + ".map(fn)", s, filterT(fn)), scope);
}
exports.filter = filter;
function filterT(fn) {
    return {
        changes: function (event, observer) {
            if (abstractions_1.isValue(event)) {
                if (fn(event.value)) {
                    observer(event);
                }
            }
            else {
                observer(event);
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