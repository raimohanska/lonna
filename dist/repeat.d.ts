import { EventStream, EventStreamSeed, ObservableSeed } from "./abstractions";
import { Scope } from "./scope";
export declare function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any> | undefined): EventStreamSeed<V>;
export declare function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any> | undefined, scope: Scope): EventStream<V>;
