"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFlexibleSubscibe = exports.toFlexibleObserver = exports.fromSubscribe = exports.SeedToStream = exports.StatelessEventStream = exports.StatefulEventStream = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var dispatcher_1 = require("./dispatcher");
// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
var StatefulEventStream = /** @class */ (function (_super) {
    __extends(StatefulEventStream, _super);
    function StatefulEventStream(desc, scope) {
        var _this = _super.call(this, desc) || this;
        _this.dispatcher = new dispatcher_1.Dispatcher();
        _this._scope = scope;
        return _this;
    }
    StatefulEventStream.prototype.subscribe = function (observer) {
        return this.dispatcher.on("value", observer);
    };
    StatefulEventStream.prototype.getScope = function () {
        return this._scope;
    };
    return StatefulEventStream;
}(abstractions_1.EventStream));
exports.StatefulEventStream = StatefulEventStream;
var StatelessEventStream = /** @class */ (function (_super) {
    __extends(StatelessEventStream, _super);
    function StatelessEventStream(desc, subscribe, scope) {
        var _this = _super.call(this, desc) || this;
        _this._scope = scope;
        _this.subscribe = subscribe;
        return _this;
    }
    StatelessEventStream.prototype.getScope = function () {
        return this._scope;
    };
    return StatelessEventStream;
}(abstractions_1.EventStream));
exports.StatelessEventStream = StatelessEventStream;
var SeedToStream = /** @class */ (function (_super) {
    __extends(SeedToStream, _super);
    function SeedToStream(seed, scope) {
        var _this = _super.call(this, seed.desc, scope) || this;
        var source = seed.consume();
        scope.subscribe(function () { return source.subscribe(function (v) { return _this.dispatcher.dispatch("value", v); }); }, _this.dispatcher);
        return _this;
    }
    return SeedToStream;
}(StatefulEventStream));
exports.SeedToStream = SeedToStream;
function fromSubscribe(subscribe, scope) {
    return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed("fromSubscribe(fn)", subscribe), scope);
}
exports.fromSubscribe = fromSubscribe;
function toFlexibleObserver(observer) {
    return function (eventLike) {
        var e_1, _a;
        var events = abstractions_1.toEvents(eventLike);
        try {
            for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                var event_1 = events_1_1.value;
                observer(event_1);
                if (abstractions_1.isEnd(event_1)) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
}
exports.toFlexibleObserver = toFlexibleObserver;
function fromFlexibleSubscibe(subscribe, scope) {
    return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed("fromSubscribe(fn)", function (observer) {
        return subscribe(toFlexibleObserver(observer));
    }), scope);
}
exports.fromFlexibleSubscibe = fromFlexibleSubscibe;
//# sourceMappingURL=eventstream.js.map