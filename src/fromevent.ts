import { EventStream } from "./abstractions";
import { StatelessEventStream } from "./eventstream";
import { toFlexibleObserver } from "./fromsubscribe";
import { globalScope } from "./scope";
import { toString } from "./tostring";
export type EventSourceFn = (binder: Function, listener: Function) => any

function isEventSourceFn(x: any): x is EventSourceFn {
  return x instanceof Function
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
  ["addEventListener","removeEventListener"],
  ["addListener", "removeListener"],
  ["on", "off"],
  ["bind", "unbind"]
];

var findHandlerMethods = function(target: any): [Function, Function] {
  var pair;
  for (var i = 0; i < eventMethods.length; i++) {
    pair = eventMethods[i];
    var methodPair = [target[pair[0]], target[pair[1]]];
    if (methodPair[0] && methodPair[1]) { return <any>methodPair; }
  }
  for (var j = 0; j < eventMethods.length; j++) {
    pair = eventMethods[j];
    var addListener = target[pair[0]];
    if (addListener) { return [addListener, function() {}]; }
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
export function fromEvent<V>(target: any, eventSource: string | EventSourceFn): EventStream<V> {
  var [sub, unsub] = findHandlerMethods(target);
  return new StatelessEventStream(["fromEvent", [target, eventSource]], (onValue, onEnd) => {
    const handler = toFlexibleObserver(onValue, onEnd)
    if (isEventSourceFn(eventSource)) {
      eventSource(sub.bind(target), handler);
      return () => eventSource(unsub.bind(target), handler);
    } else {
      sub.call(target, eventSource, handler);
      return () => unsub.call(target, eventSource, handler);
    }
  }, globalScope)
}
