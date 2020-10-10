import { EventStream, EventStreamSeed } from "./abstractions";
import { Scope } from "./scope";
export declare type Spawner<A, B> = (value: A) => (EventStreamSeed<B> | EventStream<B>);
export declare function flatMap<A, B>(s: EventStream<A>, fn: Spawner<A, B>): EventStream<B>;
export declare function flatMap<A, B>(s: EventStreamSeed<A>, fn: Spawner<A, B>, scope?: Scope): EventStreamSeed<B>;
