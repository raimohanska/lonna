import { EventStream, EventStreamSeed, Observable, Property, PropertySeed, Unsub } from "./abstractions";
import { Scope } from "./scope";
export declare type FlatMapOptions = {
    latest?: boolean;
};
export declare type Spawner<A, O> = (value: A) => O;
export interface FlatMapOp<A, B> {
    (s: EventStream<A> | EventStreamSeed<A>): EventStreamSeed<B>;
}
export interface FlatMapOpScoped<A, B> {
    (s: EventStream<A> | EventStreamSeed<A>): EventStream<B>;
}
export declare function flatMap<A, B>(fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>): FlatMapOp<A, B>;
export declare function flatMap<A, B>(fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, scope: Scope): FlatMapOpScoped<A, B>;
export declare type FlatMapChild<B extends Observable<any>> = {
    observable: B;
    unsub?: Unsub;
};
export declare class FlatMapStreamSeed<A, B> extends EventStreamSeed<B> {
    constructor(desc: string, s: EventStreamSeed<A>, fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, options?: FlatMapOptions);
}
export declare class FlatMapPropertySeed<A, B> extends PropertySeed<B> {
    constructor(desc: string, src: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, options?: FlatMapOptions);
}
