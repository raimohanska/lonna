"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequentially = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var frompoll_1 = require("./frompoll");
var util_1 = require("./util");
function sequentially(delay, values, scope) {
    var index = 0;
    return applyscope_1.applyScopeMaybe(util_1.rename("sequentially(" + delay + ", " + values + ")", frompoll_1.fromPoll(delay, function () {
        var value = values[index++];
        if (index < values.length) {
            return value;
        }
        else if (index === values.length) {
            return [abstractions_1.toEvent(value), abstractions_1.endEvent];
        }
        else {
            return abstractions_1.endEvent;
        }
    })), scope);
}
exports.sequentially = sequentially;
//# sourceMappingURL=sequentially.js.map