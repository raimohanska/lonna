"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEvent = exports.mapObserver = exports.map = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var property_1 = require("./property");
function map(o, x) {
    var desc = o + ".map(fn)";
    var fn = (x instanceof abstractions_1.Property) ? function () { return x.get(); } : x;
    if (o instanceof abstractions_1.EventStream) {
        return new eventstream_1.StatelessEventStream(desc, function (observer) { return o.subscribe(mapObserver(observer, fn)); }, o.getScope());
    }
    else if (o instanceof abstractions_1.EventStreamSeed) {
        var source_1 = o.consume();
        return new abstractions_1.EventStreamSeed(desc, function (observer) { return source_1.subscribe(mapObserver(observer, fn)); });
    }
    else if (o instanceof abstractions_1.Property) {
        return new property_1.StatelessProperty(desc, function () { return fn(o.get()); }, function (observer) { return o.onChange(mapObserver(observer, fn)); }, o.getScope());
    }
    else if (o instanceof abstractions_1.PropertySeed) {
        var source_2 = o.consume();
        return new abstractions_1.PropertySeed(desc, function () { return fn(source_2.get()); }, function (observer) {
            return source_2.onChange(mapObserver(observer, fn));
        });
    }
    throw Error("Unknown observable");
}
exports.map = map;
function mapObserver(observer, fn) {
    return function (event) { return observer(mapEvent(event, fn)); };
}
exports.mapObserver = mapObserver;
function mapEvent(event, fn) {
    if (abstractions_1.isValue(event)) {
        return abstractions_1.valueEvent(fn(event.value));
    }
    else {
        return event;
    }
}
exports.mapEvent = mapEvent;
//# sourceMappingURL=map.js.map