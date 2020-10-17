"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEvent = exports.mapObserver = exports.mapSubscribe = exports.map = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var property_1 = require("./property");
function map(o, x) {
    var desc = o + ".map(fn)";
    var fn = (x instanceof abstractions_1.Property) ? function () { return x.get(); } : x;
    if (o instanceof abstractions_1.EventStream) {
        return new eventstream_1.StatelessEventStream(desc, mapSubscribe(o.subscribe.bind(o), fn), o.getScope());
    }
    else if (o instanceof abstractions_1.EventStreamSeed) {
        var source = o.consume();
        return new abstractions_1.EventStreamSeed(desc, mapSubscribe(source.subscribe.bind(source), fn));
    }
    else if (o instanceof abstractions_1.Property) {
        return new property_1.StatelessProperty(desc, function () { return fn(o.get()); }, mapSubscribe(o.onChange.bind(o), fn), o.getScope());
    }
    else if (o instanceof abstractions_1.PropertySeed || o instanceof abstractions_1.AtomSeed) {
        var source_1 = o.consume();
        return new abstractions_1.PropertySeed(desc, function () { return fn(source_1.get()); }, mapSubscribe(source_1.onChange.bind(source_1), fn));
    }
    throw Error("Unknown observable");
}
exports.map = map;
function mapSubscribe(subscribe, fn) {
    return function (observer) { return subscribe(mapObserver(observer, fn)); };
}
exports.mapSubscribe = mapSubscribe;
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