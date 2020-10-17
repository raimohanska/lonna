import { Atom, AtomSource, Event, ObservableSeed, Observer, Property } from "./abstractions";
import * as L from "./lens";
import { Scope } from "./scope";
export declare class LensedAtom<R, V> extends Atom<V> {
    private _root;
    private _lens;
    constructor(desc: string, root: Atom<R>, view: L.Lens<R, V>);
    get(): V;
    set(newValue: V): void;
    modify(fn: (old: V) => V): void;
    onChange(observer: Observer<Event<V>>): import("./abstractions").Callback;
    getScope(): Scope;
}
export declare class StatefulDependentAtom<V> extends Atom<V> {
    private _scope;
    private _dispatcher;
    private _value;
    constructor(seed: ObservableSeed<V, AtomSource<V> | Atom<V>>, scope: Scope);
    get(): V;
    set: (updatedValue: V) => void;
    modify(fn: (old: V) => V): void;
    onChange(observer: Observer<Event<V>>): import("./abstractions").Callback;
    getScope(): Scope;
}
export declare function atom<A>(initial: A): Atom<A>;
/**
 * Create a dependent atom that reflects the value of the given Property. The `onChange` function
 * is supposed to eventually cause the `input` property to be updated to the new value.
 *
 * This constructor provides a bridge between atom-based components and "unidirectional data flow"
 * style state management.
 *
 * Note: unlike an independent atom, the dependent atom is lazy. This means that it will keep its
 * value up-to-date only if there is a subscriber to it or the underlying property.
 *
 * @param input      Property to reflect
 * @param onChange   Function to be called when `atom.set` is called
 */
export declare function atom<A>(input: Property<A>, onChange: (updatedValue: A) => void): Atom<A>;
