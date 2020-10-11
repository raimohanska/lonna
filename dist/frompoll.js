"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPoll = void 0;
/**
 * A polled function used by [fromPoll](../globals.html#frompoll)
 */
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var scheduler_1 = __importDefault(require("./scheduler"));
var util_1 = require("./util");
function fromPoll(delay, poll, scope) {
    return util_1.rename("fromPoll(" + delay + ",fn)", eventstream_1.fromSubscribe(function (observer) {
        var interval = scheduler_1.default.scheduler.setInterval(function () {
            var e_1, _a;
            var events = abstractions_1.toEvents(poll());
            try {
                for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                    var event_1 = events_1_1.value;
                    if (abstractions_1.isEnd(event_1)) {
                        scheduler_1.default.scheduler.clearInterval(interval);
                    }
                    observer(event_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, delay);
        return function () { return scheduler_1.default.scheduler.clearInterval(interval); };
    }, scope));
}
exports.fromPoll = fromPoll;
//# sourceMappingURL=frompoll.js.map