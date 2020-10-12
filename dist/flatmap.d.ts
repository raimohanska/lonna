import { EventStream, EventStreamSeed, Observable, Property, PropertySeed, Unsub } from "./abstractions";
import { Scope } from "./scope";
export declare type FlatMapOptions = {
    latest?: boolean;
};
export declare type Spawner<A, O> = (value: A) => O;
export declare function flatMap<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, Observable<B>>): EventStreamSeed<B>;
export declare function flatMap<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, Observable<B>>, scope: Scope): EventStream<B>;
export declare type FlatMapChild<B extends Observable<any>> = {
    observable: B;
    unsub?: Unsub;
};
export declare class FlatMapStreamSeed<A, B> extends EventStreamSeed<B> {
    constructor(desc: string, s: Observable<A>, fn: Spawner<A, Observable<B>>, options?: FlatMapOptions);
}
export declare class FlatMapPropertySeed<A, B> extends PropertySeed<B> {
    constructor(desc: string, src: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, options?: FlatMapOptions);
}
