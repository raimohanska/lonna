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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomSource = exports.AtomSeed = exports.Atom = exports.EventStreamSeed = exports.EventStream = exports.PropertySource = exports.PropertySeed = exports.Property = exports.ScopedObservable = exports.isObservable = exports.Observable = exports.ObservableSeed = exports.endEvent = exports.valueObserver = exports.isEnd = exports.isValue = exports.valueEvent = exports.toEvents = exports.toEvent = exports.End = exports.Value = exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event() {
    }
    return Event;
}());
exports.Event = Event;
var Value = /** @class */ (function (_super) {
    __extends(Value, _super);
    function Value(value) {
        var _this = _super.call(this) || this;
        _this.type = "value";
        _this.value = value;
        return _this;
    }
    return Value;
}(Event));
exports.Value = Value;
var End = /** @class */ (function (_super) {
    __extends(End, _super);
    function End() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "end";
        return _this;
    }
    return End;
}(Event));
exports.End = End;
function toEvent(value) {
    if (value instanceof Event) {
        return value;
    }
    return valueEvent(value);
}
exports.toEvent = toEvent;
function toEvents(value) {
    if (value instanceof Array) {
        return value.map(toEvent);
    }
    return [toEvent(value)];
}
exports.toEvents = toEvents;
function valueEvent(value) {
    return new Value(value);
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
exports.endEvent = new End();
var ObservableSeed = /** @class */ (function () {
    function ObservableSeed() {
    }
    return ObservableSeed;
}());
exports.ObservableSeed = ObservableSeed;
// Abstract classes instead of interfaces for runtime type information and instanceof
var Observable = /** @class */ (function (_super) {
    __extends(Observable, _super);
    function Observable(desc) {
        var _this = _super.call(this) || this;
        _this.desc = desc;
        return _this;
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
    Observable.prototype.consume = function () {
        return this;
    };
    return Observable;
}(ObservableSeed));
exports.Observable = Observable;
function isObservable(x) {
    return x instanceof Observable;
}
exports.isObservable = isObservable;
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
    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call
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
var PropertySeed = /** @class */ (function () {
    function PropertySeed(desc, get, onChange) {
        this.desc = desc;
        this._source = new PropertySource(desc, get, onChange);
    }
    PropertySeed.prototype.consume = function () {
        if (this._source === null)
            throw Error("PropertySeed " + this.desc + "\u00A0already consumed");
        var result = this._source;
        this._source = null;
        return result;
    };
    return PropertySeed;
}());
exports.PropertySeed = PropertySeed;
var PropertySource = /** @class */ (function (_super) {
    __extends(PropertySource, _super);
    function PropertySource(desc, get, onChange) {
        var _this = _super.call(this, desc) || this;
        _this._started = false;
        _this._subscribed = false;
        _this._get = get;
        _this.onChange_ = onChange;
        return _this;
    }
    PropertySource.prototype.get = function () {
        if (this._started)
            throw Error("PropertySeed started already: " + this);
        return this._get();
    };
    PropertySource.prototype.onChange = function (observer) {
        var _this = this;
        if (this._subscribed)
            throw Error("Multiple subscriptions not allowed to PropertySeed instance: " + this);
        this._subscribed = true;
        return this.onChange_(function (event) {
            if (isValue(event)) {
                _this._started = true;
            }
            observer(event);
        });
    };
    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call. For PropertySeeds, this is a once-in-a-lifetime opportunity though.
    PropertySource.prototype.subscribe = function (observer) {
        var unsub = this.onChange(observer);
        observer(valueEvent(this.get()));
        return unsub;
    };
    return PropertySource;
}(Observable));
exports.PropertySource = PropertySource;
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
var AtomSeed = /** @class */ (function () {
    function AtomSeed(desc, get, subscribe, set) {
        this.desc = desc;
        this._source = new AtomSource(desc, get, subscribe, set);
    }
    AtomSeed.prototype.consume = function () {
        if (this._source === null)
            throw Error("PropertySeed " + this.desc + "\u00A0already consumed");
        var result = this._source;
        this._source = null;
        return result;
    };
    return AtomSeed;
}());
exports.AtomSeed = AtomSeed;
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
var AtomSource = /** @class */ (function (_super) {
    __extends(AtomSource, _super);
    function AtomSource(desc, get, subscribe, set) {
        var _this = _super.call(this, desc, get, subscribe) || this;
        _this.set = set;
        return _this;
    }
    return AtomSource;
}(PropertySource));
exports.AtomSource = AtomSource;
//# sourceMappingURL=abstractions.js.map