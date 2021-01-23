import { Atom, AtomSource, Event, isValue, ObservableSeed, Observer, Property, Scope, Subscribe, TypeBitfield, T_ATOM, T_SOURCE, T_SCOPED, T_SEED, valueEvent, Desc } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { ObservableSeedImpl } from "./observable";
import * as L from "./lens";
import { PropertySourceImpl, StatefulProperty, PropertyBase } from "./property";
import { globalScope } from "./scope";
import { nop, toString } from "./util";

type AtomEvents<V> = { "change": V }

class RootAtom<V> extends PropertyBase<V> implements Atom<V> {    
    observableType() { return "Atom" }
    _L: TypeBitfield = T_ATOM | T_SCOPED
    private _dispatcher = new Dispatcher<AtomEvents<V>>();
    private _value: V

    constructor(desc: Desc, initialValue: V) {
        super(desc)
        this._value = initialValue        
        this.set = this.set.bind(this)
    }

    onChange(onValue: Observer<V>, onEnd?: Observer<void>) {
        return this._dispatcher.on("change", onValue, onEnd)        
    }

    get(): V {
        return this._value
    }
    set(newValue: V): void {
        this._value = newValue;
        this._dispatcher.dispatch("change", newValue)
    }

    modify(fn: (old: V) => V): void {
        this.set(fn(this._value))
    }
    getScope() {
        return globalScope
    }
}

const uninitialized = {}

export class LensedAtom<R, V> extends PropertyBase<V> implements Atom<V> {
    observableType() { return "Atom" }
    _L: TypeBitfield = T_ATOM | T_SCOPED
    private _root: Atom<R>;
    private _lens: L.Lens<R, V>;

    constructor(desc: Desc, root: Atom<R>, view: L.Lens<R, V>) {
        super(desc)
        this._root = root;
        this._lens = view;
        this.set = this.set.bind(this)
    }

    get() {
        return this._lens.get(this._root.get())
    }

    set(newValue: V) {
        this._root.set(this._lens.set(this._root.get(), newValue))
    }

    modify(fn: (old: V) => V) {
        this._root.modify(oldRoot => this._lens.set(oldRoot, fn(this._lens.get(oldRoot))))
    }

    onChange(onValue: Observer<V>, onEnd?: Observer<void>) {
        let current = uninitialized
        const unsub = this._root.onChange(event => {
            const value = this._lens.get(event)
            if (value !== current) {
                current = value
                onValue(value)
            }
        }, onEnd)
        this.getScope().subscribe(() => {
            current = this.get()
            return nop
        })
        return unsub
    }

    getScope() {
        return this._root.getScope()
    }
}

class DependentAtom<V> extends PropertyBase<V> implements Atom<V> {
    observableType() { return "Atom" }
    _L: TypeBitfield = T_ATOM | T_SCOPED
    private _input: Property<V>;
    set: (updatedValue: V) => void;

    constructor(desc: Desc, input: Property<V>, set: (updatedValue: V) => void) {
        super(desc)
        this._input = input;
        this.set = set.bind(this)
    }

    onChange(onValue: Observer<V>, onEnd?: Observer<void>) {
        return this._input.onChange(onValue, onEnd)
    }

    get() {
        return this._input.get()
    }

    modify(fn: (old: V) => V) {
        this.set(fn(this.get()))
    }

    getScope() {
        return this._input.getScope()
    }
    
}

export class StatefulDependentAtom<V> extends StatefulProperty<V> implements Atom<V> {
    observableType() { return "Atom" }
    _L: TypeBitfield = T_ATOM | T_SCOPED

    constructor(seed: ObservableSeed<V, AtomSource<V> | Atom<V>>, scope: Scope) {
        super(seed, scope)        
        this.set = (this._source as AtomSource<V>).set.bind(this);
    }

    set: (updatedValue: V) => void;
    
    modify(fn: (old: V) => V) {
        this.set(fn(this.get()))
    }
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSeedImpl<V> extends ObservableSeedImpl<V, AtomSource<V>>{
    observableType() { return "AtomSeed" }
    _L: TypeBitfield = T_ATOM | T_SEED
    constructor(desc: Desc, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(new AtomSourceImpl(desc, get, subscribe, set))
    }  
}


/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSourceImpl<V> extends PropertySourceImpl<V> implements AtomSource<V> {
    observableType() { return "AtomSource" }
    _L: TypeBitfield = T_ATOM | T_SOURCE
    set: (updatedValue: V) => void;
    constructor(desc: Desc, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(desc, get, subscribe)
        this.set = set
    }
}

export function atom<A>(initial: A): Atom<A>;
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
export function atom<A>(input: Property<A>, onChange: (updatedValue: A) => void): Atom<A>;

export function atom<A>(x: any, y?: any): Atom<A> {
    if (arguments.length == 1) {
        // TODO: construct desciptions in a structured manner like in Bacon
        // TODO: dynamic toString for atoms and properties (current value)
        return new RootAtom<A>(["Atom", [x]], x)
    } else {
        return new DependentAtom(["DependentAtom", [x, y]], x, y)
    }
}