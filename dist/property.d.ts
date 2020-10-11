import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Unsub, Event } from "./abstractions";
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
    constructor(seed: PropertySeed<V>, scope: Scope);
    onChange(observer: Observer<Event<V>>): import("./abstractions").Callback;
    get(): V;
    getScope(): Scope;
}
export declare function toProperty<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A): PropertySeed<A>;
export declare function toProperty<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B): PropertySeed<A | B>;
export declare function toProperty<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A, scope: Scope): Property<A>;
export declare function toProperty<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B, scope: Scope): Property<A | B>;
export declare function constant<A>(value: A): Property<A>;
