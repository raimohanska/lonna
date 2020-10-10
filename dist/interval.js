"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interval = void 0;
var _1 = require(".");
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var scheduler_1 = __importDefault(require("./scheduler"));
function interval(delay, value, scope) {
    return applyscope_1.applyScopeMaybe(new _1.EventStreamSeed("interval(" + delay + ", " + value + ")", function (observer) {
        var interval = scheduler_1.default.scheduler.setInterval(function () { return observer(abstractions_1.valueEvent(value)); }, delay);
        return function () { return clearInterval(interval); };
    }), scope);
}
exports.interval = interval;
//# sourceMappingURL=interval.js.map