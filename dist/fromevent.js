"use strict";
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
exports.fromEvent = void 0;
var eventstream_1 = require("./eventstream");
var scope_1 = require("./scope");
var tostring_1 = require("./tostring");
function isEventSourceFn(x) {
    return x instanceof Function;
}
// Wrap DOM EventTarget, Node EventEmitter, or
// [un]bind: (Any, (Any) -> None) -> None interfaces
// common in MVCs as EventStream
//
// target - EventTarget or EventEmitter, source of events
// eventSource - event name to bind or a function that performs custom binding
// eventTransformer - defaults to returning the first argument to handler
//
// Example 1:
//
//   Bacon.fromEventTarget(document.body, "click")
//   # => EventStream
//
//   Bacon.fromEventTarget(document.body, "scroll", {passive: true})
//   # => EventStream
//
//   Bacon.fromEventTarget (new EventEmitter(), "data")
//   # => EventStream
//
// Returns EventStream
/** @hidden */
var eventMethods = [
    ["addEventListener", "removeEventListener"],
    ["addListener", "removeListener"],
    ["on", "off"],
    ["bind", "unbind"]
];
var findHandlerMethods = function (target) {
    var pair;
    for (var i = 0; i < eventMethods.length; i++) {
        pair = eventMethods[i];
        var methodPair = [target[pair[0]], target[pair[1]]];
        if (methodPair[0] && methodPair[1]) {
            return methodPair;
        }
    }
    for (var j = 0; j < eventMethods.length; j++) {
        pair = eventMethods[j];
        var addListener = target[pair[0]];
        if (addListener) {
            return [addListener, function () { }];
        }
    }
    throw new Error("No suitable event methods in " + target);
};
/**
 creates an EventStream from events
 on a DOM EventTarget or Node.JS EventEmitter object, or an object that supports event listeners using `on`/`off` methods.
 You can also pass an optional function that transforms the emitted
 events' parameters.

 The simple form:

 ```js
 Bacon.fromEvent(document.body, "click").onValue(function() { alert("Bacon!") })
 ```

 Using a binder function:

 ```js
 Bacon.fromEvent(
 window,
 function(binder, listener) {
    binder("scroll", listener, {passive: true})
  }
 ).onValue(function() {
  console.log(window.scrollY)
})
 ```

 @param target
 @param eventSource
 @typeparam V Type of stream elements

 */
function fromEvent(target, eventSource) {
    var _a = __read(findHandlerMethods(target), 2), sub = _a[0], unsub = _a[1];
    return new eventstream_1.StatelessEventStream("fromEvent(" + tostring_1.toString(target) + "," + tostring_1.toString(eventSource) + ")", function (observer) {
        var handler = eventstream_1.toFlexibleObserver(observer);
        if (isEventSourceFn(eventSource)) {
            eventSource(sub.bind(target), handler);
            return function () { return eventSource(unsub.bind(target), handler); };
        }
        else {
            sub.call(target, eventSource, handler);
            return function () { return unsub.call(target, eventSource, handler); };
        }
    }, scope_1.globalScope);
}
exports.fromEvent = fromEvent;
//# sourceMappingURL=fromevent.js.map