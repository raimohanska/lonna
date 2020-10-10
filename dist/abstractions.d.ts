import { Scope } from "./scope";
export declare type Callback = () => void;
export declare type Observer<V> = (value: V) => void;
export declare type Unsub = Callback;
export declare abstract class Observable<V> {
    readonly desc: string;
    constructor(desc: string);
    abstract forEach(observer: Observer<V>): Unsub;
    log(message?: string): void;
    toString(): string;
}
export declare abstract class ScopedObservable<V> extends Observable<V> {
    constructor(desc: string);
    abstract getScope(): Scope;
}
export declare type PropertySubscribe<V> = (observer: Observer<V>) => [V, Unsub];
export declare abstract class Property<V> extends ScopedObservable<V> {
    constructor(desc: string);
    abstract get(): V;
    abstract onChange(observer: Observer<V>): Unsub;
    subscribe(observer: Observer<V>): [V, Unsub];
    forEach(observer: Observer<V>): Unsub;
}
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export declare class PropertySeed<V> extends Observable<V> {
    subscribe: PropertySubscribe<V>;
    constructor(desc: string, subscribe: (observer: Observer<V>) => [V, Unsub]);
    forEach(observer: Observer<V>): Unsub;
}
export declare abstract class EventStream<V> extends ScopedObservable<V> {
    constructor(desc: string);
}
export declare class EventStreamSeed<V> extends Observable<V> {
    forEach: (observer: Observer<V>) => Unsub;
    constructor(desc: string, forEach: (observer: Observer<V>) => Unsub);
}
export declare abstract class Atom<V> extends Property<V> {
    constructor(desc: string);
    abstract set(newValue: V): void;
    abstract modify(fn: (old: V) => V): void;
}
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export declare class AtomSeed<V> extends PropertySeed<V> {
    set: (updatedValue: V) => void;
    constructor(desc: string, forEach: (observer: Observer<V>) => [V, Unsub], set: (updatedValue: V) => void);
}
export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void;
}
