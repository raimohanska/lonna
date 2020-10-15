import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Spawner } from "./flatmap";
import { Scope } from "./scope";
export declare function flatMapLatest<A, B>(s: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>): PropertySeed<B>;
export declare function flatMapLatest<A, B>(s: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, scope: Scope): Property<B>;
export declare function flatMapLatest<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>): EventStreamSeed<B>;
export declare function flatMapLatest<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, scope: Scope): EventStream<B>;
