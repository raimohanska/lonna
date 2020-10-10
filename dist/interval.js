"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interval = void 0;
var applyscope_1 = require("./applyscope");
var _1 = require(".");
var scheduler_1 = __importDefault(require("./scheduler"));
function interval(delay, value, scope) {
    return applyscope_1.applyScopeMaybe(new _1.EventStreamSeed("interval(" + delay + ", " + value + ")", function (observer) {
        var interval = scheduler_1.default.scheduler.setInterval(function () { return observer(value); }, delay);
        return function () { return clearInterval(interval); };
    }), scope);
}
exports.interval = interval;
//# sourceMappingURL=interval.js.map