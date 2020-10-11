import { Event, EventStream, EventStreamSeed } from "./abstractions";
import { Scope } from "./scope";
/**
 Creates a stream containing given
 values (given as array). Delivered with given interval in milliseconds.

 @param delay between elements, in milliseconds
 @param array of values or events
 @typeparam V Type of stream elements

 */
export declare function sequentially<V>(delay: number, values: (V | Event<V>)[], scope: Scope): EventStream<V>;
export declare function sequentially<V>(delay: number, values: (V | Event<V>)[]): EventStreamSeed<V>;
