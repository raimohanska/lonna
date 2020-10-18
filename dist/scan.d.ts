import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare function scan<A, B>(initial: B, fn: (state: B, next: A) => B, scope: Scope): (stream: EventStream<A> | EventStreamSeed<A>) => Property<B>;
export declare function scan<A, B>(initial: B, fn: (state: B, next: A) => B): (stream: EventStream<A> | EventStreamSeed<A>) => PropertySeed<B>;
