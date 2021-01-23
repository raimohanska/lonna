import { endEvent, Event, Scope, EventStream, EventStreamSeed, toEvent } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { fromPoll } from "./frompoll";
import { rename } from "./util";

/**
 Creates a stream containing given
 values (given as array). Delivered with given interval in milliseconds.

 @param delay between elements, in milliseconds
 @param array of values or events
 @typeparam V Type of stream elements

 */
export function sequentially<V>(delay: number, values: (V | Event<V>)[], scope: Scope): EventStream<V>
export function sequentially<V>(delay: number, values: (V | Event<V>)[]): EventStreamSeed<V>

export function sequentially<V>(delay: number, values: (V | Event<V>)[], scope?: Scope): any {
  var index = 0;
  return applyScopeMaybe(rename(() => `sequentially(${delay}, ${values})`, fromPoll<V>(delay, () => {
    var value = values[index++];
    if (index < values.length) {
      return value;
    } else if (index === values.length) {
      return [toEvent(value), endEvent];
    } else {
      return endEvent;
    }
  })), scope)
}