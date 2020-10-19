import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Spawner } from "./flatmap";
import { Scope } from "./scope";
import { BinaryTransformOp, BinaryTransformOpScoped } from "./transform";
export declare function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>): BinaryTransformOp<A, B>;
export declare function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>, scope: Scope): BinaryTransformOpScoped<A, B>;
