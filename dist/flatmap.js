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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
exports.FlatMapPropertySeed = exports.FlatMapStreamSeed = exports.flatMap = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var util_1 = require("./util");
function flatMap(fn, scope) {
    return function (s) {
        return applyscope_1.applyScopeMaybe(new FlatMapStreamSeed(s + ".flatMap(fn)", s, fn, {}), scope);
    }; // TODO: type coercion. EventStream should implement Seed (but now impossible because of inheritance)
}
exports.flatMap = flatMap;
var FlatMapStreamSeed = /** @class */ (function (_super) {
    __extends(FlatMapStreamSeed, _super);
    function FlatMapStreamSeed(desc, s, fn, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = __read(flatMapSubscribe(s.consume().subscribe.bind(s), fn, options), 2), children = _a[0], subscribe = _a[1];
        _this = _super.call(this, desc, subscribe) || this;
        return _this;
    }
    return FlatMapStreamSeed;
}(abstractions_1.EventStreamSeed));
exports.FlatMapStreamSeed = FlatMapStreamSeed;
var FlatMapPropertySeed = /** @class */ (function (_super) {
    __extends(FlatMapPropertySeed, _super);
    function FlatMapPropertySeed(desc, src, fn, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var source = src instanceof abstractions_1.Property ? src : src.consume();
        var initializing = true; // Flag used to prevent the initial value from leaking to the external subscriber. Yes, this is hack.
        var subscribeWithInitial = function (observer) {
            var unsub = source.onChange(observer);
            observer(abstractions_1.valueEvent(source.get())); // To spawn property for initial value
            initializing = false;
            return unsub;
        };
        var _a = __read(flatMapSubscribe(subscribeWithInitial, fn, options), 2), children = _a[0], subscribe = _a[1];
        var get = function () {
            if (children.length != 1) {
                throw Error("Unexpected child count: " + children.length);
            }
            var observable = children[0].observable;
            if (observable instanceof abstractions_1.Property || observable instanceof abstractions_1.PropertySource) {
                return observable.get();
            }
            else {
                throw Error("Observable returned by the spawner function if flatMapLatest for Properties must return a Property. This one is not a Property: " + observable);
            }
        };
        _this = _super.call(this, desc, get, function (observer) { return subscribe(function (value) {
            if (!initializing)
                observer(value);
        }); }) || this;
        return _this;
    }
    return FlatMapPropertySeed;
}(abstractions_1.PropertySeed));
exports.FlatMapPropertySeed = FlatMapPropertySeed;
function flatMapSubscribe(subscribe, fn, options) {
    var children = [];
    return [children, function (observer) {
            var rootEnded = false;
            var unsubThis = subscribe(function (rootEvent) {
                var e_1, _a;
                if (abstractions_1.isValue(rootEvent)) {
                    if (options.latest) {
                        try {
                            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                                var child_1 = children_1_1.value;
                                child_1.unsub();
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        children.splice(0);
                    }
                    var child_2 = { observable: fn(rootEvent.value).consume() };
                    children.push(child_2);
                    var ended_1 = false;
                    child_2.unsub = child_2.observable.subscribe(function (childEvent) {
                        if (abstractions_1.isValue(childEvent)) {
                            observer(childEvent);
                        }
                        else {
                            util_1.remove(children, child_2);
                            if (child_2.unsub) {
                                child_2.unsub();
                            }
                            else {
                                ended_1 = true;
                            }
                            if (children.length === 0 && rootEnded) {
                                observer(abstractions_1.endEvent);
                            }
                        }
                    });
                    if (ended_1) {
                        child_2.unsub();
                    }
                }
                else {
                    rootEnded = true;
                    if (children.length === 0) {
                        observer(abstractions_1.endEvent);
                    }
                }
            });
            return function () {
                unsubThis();
                children.forEach(function (child) { return child.unsub && child.unsub(); });
            };
        }];
}
//# sourceMappingURL=flatmap.js.map