"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferWithCount = exports.bufferWithTime = void 0;
var abstractions_1 = require("./abstractions");
var scheduler_1 = __importDefault(require("./scheduler"));
var transform_1 = require("./transform");
var util_1 = require("./util");
// TODO: improve types and have EventStream implement EventStreamSeed
function bufferWithTime(delay) {
    return function (src) { return bufferWithTimeOrCount(src + (".bufferWithTime(" + delay + ")"), src, delay, Number.MAX_VALUE); };
}
exports.bufferWithTime = bufferWithTime;
;
function bufferWithCount(count) {
    return function (src) { return bufferWithTimeOrCount(src + (".bufferWithCount(" + count + ")"), src, undefined, count); };
}
exports.bufferWithCount = bufferWithCount;
;
function bufferWithTimeOrCount(desc, src, delay, count) {
    var delayFunc = toDelayFunction(delay);
    function flushOrSchedule(buffer) {
        if (buffer.values.length === count) {
            //console.log Bacon.scheduler.now() + ": count-flush"
            return buffer.flush();
        }
        else if (delayFunc !== undefined) {
            return buffer.schedule(delayFunc);
        }
    }
    return buffer(desc, src, flushOrSchedule, flushOrSchedule);
}
// Commented-out end handling from Bacon
var Buffer = /** @class */ (function () {
    function Buffer(onFlush, onInput) {
        this.push = function (e) { return undefined; };
        this.scheduled = null;
        this.end = undefined;
        this.values = [];
        this.onFlush = onFlush;
        this.onInput = onInput;
    }
    Buffer.prototype.flush = function () {
        if (this.scheduled) {
            scheduler_1.default.scheduler.clearTimeout(this.scheduled);
            this.scheduled = null;
        }
        if (this.values.length > 0) {
            //console.log Bacon.scheduler.now() + ": flush " + @values
            var valuesToPush = this.values;
            this.values = [];
            this.push(abstractions_1.valueEvent(valuesToPush));
            if ((this.end != null)) {
                return this.push(this.end);
            }
            else {
                return this.onFlush(this);
            }
        }
        else {
            if ((this.end != null)) {
                return this.push(this.end);
            }
        }
    };
    Buffer.prototype.schedule = function (delay) {
        var _this = this;
        if (!this.scheduled) {
            return this.scheduled = delay(function () {
                //console.log Bacon.scheduler.now() + ": scheduled flush"
                return _this.flush();
            });
        }
    };
    return Buffer;
}());
function toDelayFunction(delay) {
    if (delay === undefined) {
        return undefined;
    }
    if (typeof delay === "number") {
        var delayMs = delay;
        return function (f) {
            //console.log Bacon.scheduler.now() + ": schedule for " + (Bacon.scheduler.now() + delayMs)
            return scheduler_1.default.scheduler.setTimeout(f, delayMs);
        };
    }
    return delay;
}
/** @hidden */
function buffer(desc, src, onInput, onFlush) {
    if (onInput === void 0) { onInput = util_1.nop; }
    if (onFlush === void 0) { onFlush = util_1.nop; }
    //var reply = more;
    var buffer = new Buffer(onFlush, onInput);
    var transformer = function (event, sink) {
        buffer.push = sink;
        if (abstractions_1.isValue(event)) {
            buffer.values.push(event.value);
            //console.log Bacon.scheduler.now() + ": input " + event.value
            onInput(buffer);
        }
        else {
            buffer.end = event;
            if (!buffer.scheduled) {
                //console.log Bacon.scheduler.now() + ": end-flush"
                buffer.flush();
            }
        }
    };
    return transform_1.transform(desc, transformer)(src);
}
;
//# sourceMappingURL=buffer.js.map