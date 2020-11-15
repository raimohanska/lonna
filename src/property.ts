import { Event, isValue, ObservableSeed, Observer, Property, PropertySeed, PropertySource, Scope, Subscribe, TypeBitfield, T_SOURCE, T_PROPERTY, T_SCOPED, T_SEED, Unsub, valueEvent } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { ObservableBase, ObservableSeedImpl } from "./observable";
import { afterScope, beforeScope, checkScope, OutOfScope } from "./scope";

type PropertyEvents<V> = { "change": V }
const uninitialized = {}

export abstract class PropertyBase<V> extends ObservableBase<V> implements Property<V>, PropertySeed<V>, PropertySource<V> {
    constructor(desc: string) {
        super(desc)
    }

    abstract getScope(): Scope;

    abstract get(): V

    abstract onChange(observer: Observer<Event<V>>): Unsub;

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call
    subscribe(observer: Observer<Event<V>>): Unsub {        
        const unsub = this.onChange(observer)
        observer(valueEvent(this.get()))
        return unsub
    }    
}

export class StatelessProperty<V> extends PropertyBase<V> {
    _L: TypeBitfield = T_PROPERTY | T_SCOPED
    get: () => V;
    private _onChange: (observer: Observer<Event<V>>) => Unsub;
    private _scope: Scope

    constructor(desc: string, get: () => V, onChange: (observer: Observer<Event<V>>) => Unsub, scope: Scope) {
        super(desc)
        this.get = get
        this._onChange = onChange
        this._scope = scope
    }

    onChange(observer: Observer<Event<V>>) {
        let current = uninitialized
        const unsub = this._onChange(event => {
            if (isValue(event)) {
                if (event.value !== current) {
                    current = event.value
                    observer(event)
                }
            } else {
                observer(event)
            }
        })
        current = this.get()
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
        
        const meAsObserver = (event: Event<V>) => {
            if (isValue(event)) {
                if (event.value !== this._value) {
                    this._value = event.value
                    this._dispatcher.dispatch("change", event)
                }
            } else {
                this._dispatcher.dispatch("change", event)
            }
        }
        scope.subscribe(
            () => {
                const unsub = this._source.onChange(meAsObserver);                
                this._value = this._source.get();
                return () => {
                    this._value = afterScope; 
                    unsub!()
                }
            },
            this._dispatcher
        );
    }

    onChange(observer: Observer<Event<V>>) {
        return this._dispatcher.on("change", observer)
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

    onChange(observer: Observer<Event<V>>): Unsub {                
        if (this._subscribed) throw Error("Multiple subscriptions not allowed to PropertySeed instance: " + this)
        this._subscribed = true
        return this.onChange_(event => {
            if (isValue(event)) {
                this._started = true
            }
            observer(event)
        })
    }

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call. For PropertySeeds, this is a once-in-a-lifetime opportunity though.
    subscribe(observer: Observer<Event<V>>): Unsub {        
        const unsub = this.onChange(observer)
        observer(valueEvent(this.get()))
        return unsub
    }       
}
