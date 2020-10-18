import { Event, EventStream, EventStreamSeed, ObservableSeed, Observer, Property, PropertySeed, PropertySource, Subscribe, Unsub } from "./abstractions";
import { Scope } from "./scope";
export declare class StatelessProperty<V> extends Property<V> {
    get: () => V;
    private _onChange;
    private _scope;
    constructor(desc: string, get: () => V, onChange: (observer: Observer<Event<V>>) => Unsub, scope: Scope);
    onChange(observer: Observer<Event<V>>): import("./abstractions").Callback;
    getScope(): Scope;
}
export declare class StatefulProperty<V> extends Property<V> {
    private _dispatcher;
    private _scope;
    private _value;
    constructor(seed: ObservableSeed<V, PropertySource<V> | Property<V>>, scope: Scope);
    onChange(observer: Observer<Event<V>>): import("./abstractions").Callback;
    get(): V;
    getScope(): Scope;
}
export interface ToStatelessPropertyOp<A> {
    (stream: EventStream<any>): Property<A>;
    (onChange: Subscribe<any>): Property<A>;
}
export declare function toStatelessProperty<A>(get: () => A): ToStatelessPropertyOp<A>;
export interface ToPropertyOp<A> {
    (stream: EventStream<A> | EventStreamSeed<A>): PropertySeed<A>;
    <B>(stream: EventStream<B> | EventStreamSeed<B>): PropertySeed<A | B>;
}
export interface ToPropertyOpScoped<A> {
    (stream: EventStream<A> | EventStreamSeed<A>): Property<A>;
    <B>(stream: EventStream<B> | EventStreamSeed<A>): Property<A | B>;
}
export declare function toProperty<A>(initial: A): ToPropertyOp<A>;
export declare function toProperty<A>(initial: A, scope: Scope): ToPropertyOpScoped<A>;
export declare function toPropertySeed<A>(property: Property<A> | PropertySeed<A>): PropertySeed<A>;
export declare function constant<A>(value: A): Property<A>;
