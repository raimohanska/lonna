import { EventStream, EventStreamSeed } from "./abstractions";
export declare function merge<A>(a: EventStream<A>, b: EventStream<A>): EventStream<A>;
export declare function merge<A, B>(a: EventStream<A>, b: EventStream<B>): EventStream<A | B>;
export declare function merge<A>(a: EventStreamSeed<A>, b: EventStreamSeed<A>): EventStreamSeed<A>;
export declare function merge<A, B>(a: EventStreamSeed<A>, b: EventStreamSeed<B>): EventStreamSeed<A | B>;
export declare function merge<A>(streams: EventStreamSeed<A>[]): EventStreamSeed<A>;
