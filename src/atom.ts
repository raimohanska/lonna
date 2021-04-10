import { Atom, AtomSource, Event, isValue, ObservableSeed, Observer, Property, Scope, Subscribe, TypeBitfield, T_ATOM, T_SOURCE, T_SCOPED, T_SEED, valueEvent, Desc, Unsub, AtomSeed } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { ObservableBase, ObservableSeedImpl } from "./observable";
import * as L from "./lens";
import { PropertySourceImpl, StatefulProperty, PropertyBase, StatelessProperty } from "./property";
import { globalScope, scopedSubscribe } from "./scope";
import { nop, toString } from "./util";
import { HKT } from "./hkt";

type AtomEvents<V> = { "change": V }

class RootAtom<V> extends PropertyBase<V, Atom<V>> implements Atom<V> {    
    public [HKT]!: Atom<V>
    observableType() { return "Atom" as const }
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

    applyScope(scope: Scope): Atom<V> {
        return new ScopedAtom(this, scope)
    }
}

const uninitialized = {}

export class LensedAtom<R, V> extends PropertyBase<V, Atom<V>> implements Atom<V> {
    public [HKT]!: Atom<V>
    observableType() { return "Atom" as const }
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
        return scopedSubscribe(this.getScope(), () => {
            let current = this.get()
            return this._root.onChange(event => {
                const value = this._lens.get(event)
                if (value !== current) {
                    current = value
                    onValue(value)
                }
            }, onEnd)
        })
    }

    getScope() {
        return this._root.getScope()
    }

    applyScope(scope: Scope): Atom<V> {
        return new ScopedAtom(this, scope)
    }
}

class DependentAtom<V> extends PropertyBase<V, Atom<V>> implements Atom<V> {
    public [HKT]!: Atom<V>
    observableType() { return "Atom" as const }
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
    
    applyScope(scope: Scope): Atom<V> {
        return new ScopedAtom(this, scope)
    }    
}


export class StatefulDependentAtom<V> extends StatefulProperty<V, Atom<V>> implements Atom<V> {
    public [HKT]!: Atom<V>
    observableType() { return "Atom" as const }
    _L: TypeBitfield = T_ATOM | T_SCOPED

    constructor(seed: ObservableSeed<V, AtomSource<V> | Atom<V>, Atom<V>>, scope: Scope) {
        super(seed, scope)        
        this.set = (this._source as AtomSource<V>).set.bind(this);
    }

    set: (updatedValue: V) => void;
    
    modify(fn: (old: V) => V) {
        this.set(fn(this.get()))
    }

    applyScope(scope: Scope): Atom<V> {
        return new ScopedAtom(this, scope)
    }    
}

class ScopedAtom<V> extends StatelessProperty<V, Atom<V>> implements Atom<V> {    
    public [HKT]!: Atom<V>
    _src: Atom<V>    
    constructor(src: Atom<V>, scope: Scope) {
        super(src.desc, src.get.bind(src), src.onChange.bind(src), scope) // StatelessProperty applies scope.
        this._src = src
    }

    set(updatedValue: V) {
        this._src.set(updatedValue)
    }

    modify(fn: (old: V) => V) {
        this._src.modify(fn)
    }

    // TODO: repeating override in all Atom implementations (forget one and you'll get wrong return value!)
    applyScope(scope: Scope): Atom<V> {
        return new ScopedAtom(this, scope)
    }
    observableType() { return "Atom" as const }
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSeedImpl<V> extends ObservableSeedImpl<V, AtomSource<V>, Atom<V>>{
    public [HKT]!: AtomSeed<V>
    observableType() { return "AtomSeed" as const }
    _L: TypeBitfield = T_ATOM | T_SEED
    constructor(desc: Desc, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(new AtomSourceImpl(desc, get, subscribe, set))
    }  

    applyScope(scope: Scope): Atom<V> { 
        return new StatefulDependentAtom(this, scope)
    }
}


/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSourceImpl<V> extends ObservableBase<V, Atom<V>> implements AtomSource<V> {
    // TODO: copypaste of PropertySource
    public [HKT]!: AtomSource<V>
    _L: TypeBitfield = T_ATOM | T_SOURCE
    observableType() { return "AtomSource" as const }
    private _started = false
    private _subscribed = false
    private _get: () => V

    onChange_: Subscribe<V>;
    set: (updatedValue: V) => void;

    get() {
        if (this._started) throw Error("PropertySeed started already: " + this)
        return this._get()
    }

    constructor(desc: Desc, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(desc)
        this._get = get;
        this.onChange_ = subscribe;
        this.set = set
    }

    onChange(onValue: Observer<V>, onEnd?: Observer<void>): Unsub {                
        if (this._subscribed) throw Error("Multiple subscriptions not allowed to PropertySeed instance: " + this)
        this._subscribed = true
        return this.onChange_(event => {
            this._started = true
            onValue(event)
        }, onEnd)
    }

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call. For PropertySeeds, this is a once-in-a-lifetime opportunity though.
    subscribe(onValue: Observer<V>, onEnd?: Observer<void>): Unsub {        
        const unsub = this.onChange(onValue, onEnd)
        onValue(this.get())
        return unsub
    }       

    applyScope(scope: Scope): Atom<V> { 
        return new StatefulDependentAtom(this, scope)
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