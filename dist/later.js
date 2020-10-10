"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.later = void 0;
var applyscope_1 = require("./applyscope");
var _1 = require(".");
var scheduler_1 = __importDefault(require("./scheduler"));
function later(delay, value, scope) {
    return applyscope_1.applyScopeMaybe(new _1.EventStreamSeed("interval(" + delay + ", " + value + ")", function (observer) {
        var timeout = scheduler_1.default.scheduler.setTimeout(function () { return observer(value); }, delay);
        return function () { return clearTimeout(timeout); };
    }), scope);
}
exports.later = later;
//# sourceMappingURL=later.js.map