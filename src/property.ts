import { Event, isValue, ObservableSeed, Observer, Property, PropertySource, Scope, TypeBitfield, T_PROPERTY, T_SCOPED, Unsub } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { PropertyBase } from "./implementations";
import { afterScope, beforeScope, checkScope, OutOfScope } from "./scope";

type PropertyEvents<V> = { "change": V }
const uninitialized = {}
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