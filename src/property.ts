import { Event, EventStream, EventStreamSeed, EventStreamSource, isValue, ObservableSeed, Observer, Property, PropertySeed, PropertySource, Subscribe, Unsub } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Dispatcher } from "./dispatcher";
import { never } from "./never";
import { afterScope, beforeScope, checkScope, globalScope, OutOfScope, Scope } from "./scope";
import { rename } from "./util";

type PropertyEvents<V> = { "change": V }
const uninitialized = {}
export class StatelessProperty<V> extends Property<V> {
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

export class StatefulProperty<V> extends Property<V> {
    private _dispatcher = new Dispatcher<PropertyEvents<V>>();
    private _scope: Scope
    private _value: V | OutOfScope  = beforeScope

    constructor(seed: ObservableSeed<V, PropertySource<V> | Property<V>>, scope: Scope) {
        super(seed.desc)
        this._scope = scope
        
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
        scope(
            () => {
                const source = seed.consume()
                const unsub = source.onChange(meAsObserver);                
                this._value = source.get();
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
export function toStatelessProperty<A>(stream: EventStream<A>, get: () => A): Property<A>
export function toStatelessProperty<A>(onChange: Subscribe<A>, get: () => A): Property<A>

export function toStatelessProperty<A>(streamOrSubscribe: any, get: () => A): Property<A> {
    if (streamOrSubscribe instanceof EventStream) {        
        return new StatelessProperty(streamOrSubscribe.desc, get, streamOrSubscribe.subscribe.bind(streamOrSubscribe), streamOrSubscribe.getScope())
    } else {
        return new StatelessProperty(`toStatelessProperty(${streamOrSubscribe},${get}`, get, streamOrSubscribe, globalScope)
    }
}

export function toProperty<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A): PropertySeed<A>;
export function toProperty<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B): PropertySeed<A | B>;
export function toProperty<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A, scope: Scope): Property<A>;
export function toProperty<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B, scope: Scope): Property<A | B>;

export function toProperty(seed: EventStream<any> | EventStreamSeed<any>, initial: any, scope?: Scope): Property<any> | PropertySeed<any> {    
    const source = seed.consume()
    return applyScopeMaybe(new PropertySeed(seed + `.toProperty(${initial})`, () => initial, (observer: Observer<any>) => {        
        return source.subscribe(observer)
    }), scope)
}

export function toPropertySeed<A>(property: Property<A> | PropertySeed<A>): PropertySeed<A> {
    if (property instanceof PropertySeed) {
        return property;
    }
    return new PropertySeed<A>(property.desc, property.get.bind(property), property.onChange.bind(property))
}

export function constant<A>(value: A): Property<A> {
    return rename(`constant(${value})`, toProperty(never(), value, globalScope))
}