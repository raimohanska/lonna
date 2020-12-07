import { Event, isValue, ObservableSeed, Observer, Property, PropertySeed, PropertySource, Scope, Subscribe, TypeBitfield, T_SOURCE, T_PROPERTY, T_SCOPED, T_SEED, Unsub, valueEvent } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { ObservableBase, ObservableSeedImpl } from "./observable";
import { afterScope, beforeScope, checkScope, OutOfScope } from "./scope";
import { nop } from "./util";

type PropertyEvents<V> = { "change": V, "end": void }
const uninitialized = {}

export abstract class PropertyBase<V> extends ObservableBase<V> implements Property<V>, PropertySeed<V>, PropertySource<V> {
    constructor(desc: string) {
        super(desc)
    }

    abstract getScope(): Scope;

    abstract get(): V

    abstract onChange(onValue: Observer<V>, onEnd: Observer<void>): Unsub;

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call
    subscribe(onValue: Observer<V>, onEnd: Observer<void>): Unsub {
        const unsub = this.onChange(onValue, onEnd) // onChange call needs to be before get() call for autoScope to work.

        this.getScope().subscribe(() => {
            onValue(this.get())
            return nop
        })
        
        return unsub
    }    
}

export class StatelessProperty<V> extends PropertyBase<V> {
    _L: TypeBitfield = T_PROPERTY | T_SCOPED
    get: () => V;
    private _onChange: Subscribe<V>;
    private _scope: Scope

    constructor(desc: string, get: () => V, onChange: Subscribe<V>, scope: Scope) {
        super(desc)
        this.get = get
        this._onChange = onChange
        this._scope = scope
    }

    onChange(onValue: Observer<V>, onEnd: Observer<void>) {
        if (!onEnd) throw Error("Assertion fail")
        let current = uninitialized
        const unsub = this._onChange(event => {
            if (event !== current) {
                current = event
                onValue(event)
            }
        }, () => onEnd())
        this.getScope().subscribe(() => {
            current = this.get()
            return nop
        })        
        return unsub
    }

    getScope() {
        return this._scope
    }
}

export class StatefulProperty<V> extends PropertyBase<V> {
    _L: TypeBitfield = T_PROPERTY | T_SCOPED
    private _dispatcher = new Dispatcher<PropertyEvents<V>>();
    private _scope: Scope
    private _value: V | OutOfScope  = beforeScope
    protected _source: PropertySource<V>

    constructor(seed: ObservableSeed<V, PropertySource<V> | Property<V>>, scope: Scope) {
        super(seed.desc)
        this._scope = scope
        this._source = seed.consume()
        
        scope.subscribe(
            () => {
                const unsub = this._source.onChange(event => {
                    if (event !== this._value) {
                        this._value = event
                        this._dispatcher.dispatch("change", event)
                    }
                }, () => this._dispatcher.dispatchEnd("change"));                
                this._value = this._source.get();
                return () => {
                    this._value = afterScope; 
                    unsub!()
                }
            },
            this._dispatcher
        );
    }

    onChange(onValue: Observer<V>, onEnd: Observer<void>) {
        return this._dispatcher.on("change", onValue, onEnd)
    }
    
    get(): V {
        return checkScope(this, this._value)
    }

    getScope() {
        return this._scope
    }
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class PropertySeedImpl<V> extends ObservableSeedImpl<V, PropertySource<V>> implements PropertySeed<V> {
    _L: TypeBitfield = T_PROPERTY | T_SEED
    constructor(desc: string, get: () => V, onChange: Subscribe<V>) {
        super(new PropertySourceImpl(desc, get, onChange))
    }  
}

export class PropertySourceImpl<V> extends ObservableBase<V> implements PropertySource<V> {
    _L: TypeBitfield = T_PROPERTY | T_SOURCE
    private _started = false
    private _subscribed = false
    private _get: () => V

    onChange_: Subscribe<V>;

    get() {
        if (this._started) throw Error("PropertySeed started already: " + this)
        return this._get()
    }

    constructor(desc: string, get: () => V, onChange: Subscribe<V>) {
        super(desc)
        this._get = get;
        this.onChange_ = onChange;
    }

    onChange(onValue: Observer<V>, onEnd: Observer<void>): Unsub {                
        if (this._subscribed) throw Error("Multiple subscriptions not allowed to PropertySeed instance: " + this)
        this._subscribed = true
        return this.onChange_(event => {
            this._started = true
            onValue(event)
        }, onEnd)
    }

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call. For PropertySeeds, this is a once-in-a-lifetime opportunity though.
    subscribe(onValue: Observer<V>, onEnd: Observer<void>): Unsub {        
        const unsub = this.onChange(onValue, onEnd)
        onValue(this.get())
        return unsub
    }       
}
