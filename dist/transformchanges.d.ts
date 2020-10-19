import { EventStreamSeed } from "./abstractions";
import { Scope } from "./scope";
import { UnaryTransformOp, UnaryTransformOpScoped } from "./transform";
export declare type EventStreamDelay<V> = (stream: EventStreamSeed<V>) => EventStreamSeed<V>;
export declare function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>): UnaryTransformOp<A>;
export declare function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>, scope: Scope): UnaryTransformOpScoped<A>;
