"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.take = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var transform_1 = require("./transform");
function take(count, scope) {
    return function (s) {
        return applyscope_1.applyScopeMaybe(transform_1.transform(s + ".map(fn)", takeT(count))(s), scope);
    };
}
exports.take = take;
function takeT(count) {
    return {
        changes: function (e, observer) {
            if (!abstractions_1.isValue(e)) {
                observer(e);
            }
            else {
                count--;
                if (count > 0) {
                    observer(e);
                }
                else {
                    if (count === 0) {
                        observer(e);
                        observer(abstractions_1.endEvent);
                    }
                }
            }
        },
        init: function (value) {
            return value;
        }
    };
}
//# sourceMappingURL=take.js.map