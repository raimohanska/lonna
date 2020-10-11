/**
 * A polled function used by [fromPoll](../globals.html#frompoll)
 */
import { EventLike, EventStream, EventStreamSeed } from "./abstractions";
import { Scope } from "./scope";
export declare type PollFunction<V> = () => EventLike<V>;
/**
 Polls given function with given interval.
 When there are subscribers to the stream. Polling ends permanently when
 `f` returns an End event.

 * @param delay poll interval in milliseconds
 * @param poll function to be polled. Can return either V, Event<V> or an array of Event<V>. In the latter cases the End event can be used to stop polling.
 * @typeparam V Type of stream elements
 */
export declare function fromPoll<V>(delay: number, poll: PollFunction<V>, scope: Scope): EventStream<V>;
export declare function fromPoll<V>(delay: number, poll: PollFunction<V>): EventStreamSeed<V>;
