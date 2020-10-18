import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Spawner } from "./flatmap";
import { Scope } from "./scope";
export interface FlatMapLatestOp<A, B> {
    (s: Property<A> | PropertySeed<A>): PropertySeed<B>;
    (s: EventStream<A> | EventStreamSeed<A>): EventStreamSeed<B>;
}
export interface FlatMapLatestOpScoped<A, B> {
    (s: Property<A> | PropertySeed<A>): Property<B>;
    (s: EventStream<A> | EventStreamSeed<A>): EventStream<B>;
}
export declare function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>): FlatMapLatestOp<A, B>;
export declare function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>, scope: Scope): FlatMapLatestOpScoped<A, B>;
