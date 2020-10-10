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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomSeed = exports.Atom = exports.EventStreamSeed = exports.EventStream = exports.PropertySeed = exports.Property = exports.ScopedObservable = exports.Observable = exports.endEvent = exports.valueObserver = exports.isEnd = exports.isValue = exports.valueEvent = void 0;
function valueEvent(value) {
    return { type: "value", value: value };
}
exports.valueEvent = valueEvent;
function isValue(event) {
    return event.type === "value";
}
exports.isValue = isValue;
function isEnd(event) {
    return event.type === "end";
}
exports.isEnd = isEnd;
function valueObserver(observer) {
    return function (event) { if (isValue(event))
        observer(event.value); };
}
exports.valueObserver = valueObserver;
exports.endEvent = { type: "end" };
// Abstract classes instead of interfaces for runtime type information and instanceof
var Observable = /** @class */ (function () {
    function Observable(desc) {
        this.desc = desc;
    }
    Observable.prototype.forEach = function (observer) {
        return this.subscribe(valueObserver(observer));
    };
    Observable.prototype.log = function (message) {
        this.forEach(function (v) { return message === undefined ? console.log(v) : console.log(message, v); });
    };
    Observable.prototype.toString = function () {
        return this.desc;
    };
    return Observable;
}());
exports.Observable = Observable;
var ScopedObservable = /** @class */ (function (_super) {
    __extends(ScopedObservable, _super);
    function ScopedObservable(desc) {
        return _super.call(this, desc) || this;
    }
    return ScopedObservable;
}(Observable));
exports.ScopedObservable = ScopedObservable;
var Property = /** @class */ (function (_super) {
    __extends(Property, _super);
    function Property(desc) {
        return _super.call(this, desc) || this;
    }
    Property.prototype.subscribeWithInitial = function (observer) {
        var unsub = this.onChange(observer);
        return [this.get(), unsub];
    };
    Property.prototype.subscribe = function (observer) {
        var unsub = this.onChange(observer);
        observer(valueEvent(this.get()));
        return unsub;
    };
    return Property;
}(ScopedObservable));
exports.Property = Property;
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
var PropertySeed = /** @class */ (function (_super) {
    __extends(PropertySeed, _super);
    function PropertySeed(desc, subscribeWithInitial) {
        var _this = _super.call(this, desc) || this;
        _this.subscribeWithInitial = subscribeWithInitial;
        return _this;
    }
    PropertySeed.prototype.subscribe = function (observer) {
        var _a = __read(this.subscribeWithInitial(observer), 2), init = _a[0], unsub = _a[1];
        observer(valueEvent(init));
        return unsub;
    };
    return PropertySeed;
}(Observable));
exports.PropertySeed = PropertySeed;
var EventStream = /** @class */ (function (_super) {
    __extends(EventStream, _super);
    function EventStream(desc) {
        return _super.call(this, desc) || this;
    }
    return EventStream;
}(ScopedObservable));
exports.EventStream = EventStream;
var EventStreamSeed = /** @class */ (function (_super) {
    __extends(EventStreamSeed, _super);
    function EventStreamSeed(desc, subscribe) {
        var _this = _super.call(this, desc) || this;
        _this.subscribe = subscribe;
        return _this;
    }
    return EventStreamSeed;
}(Observable));
exports.EventStreamSeed = EventStreamSeed;
var Atom = /** @class */ (function (_super) {
    __extends(Atom, _super);
    function Atom(desc) {
        return _super.call(this, desc) || this;
    }
    return Atom;
}(Property));
exports.Atom = Atom;
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
var AtomSeed = /** @class */ (function (_super) {
    __extends(AtomSeed, _super);
    function AtomSeed(desc, subscribe, set) {
        var _this = _super.call(this, desc, subscribe) || this;
        _this.set = set;
        return _this;
    }
    return AtomSeed;
}(PropertySeed));
exports.AtomSeed = AtomSeed;
//# sourceMappingURL=abstractions.js.map