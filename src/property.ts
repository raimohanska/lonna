import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Unsub } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { never } from "./never";
import { beforeScope, checkScope, globalScope, OutOfScope, Scope } from "./scope";
import { duplicateSkippingObserver } from "./util";

type PropertyEvents<V> = { "change": V }

export class StatelessProperty<V> extends Property<V> {
    get: () => V;
    private _onChange: (observer: Observer<V>) => Unsub;
    private _scope: Scope

    constructor(desc: string, get: () => V, onChange: (observer: Observer<V>) => Unsub, scope: Scope) {
        super(desc)
        this.get = get
        this._onChange = onChange
        this._scope = scope
    }

    onChange(observer: Observer<V>) {
        const initial = this.get()
        const dso = duplicateSkippingObserver(initial, observer)
        return this._onChange(dso)
    }

    getScope() {
        return this._scope
    }
}

export class StatefulProperty<V> extends Property<V> {
    private _dispatcher = new Dispatcher<PropertyEvents<V>>();
    private _scope: Scope
    private _value: V | OutOfScope  = beforeScope
    
    constructor(seed: PropertySeed<V>, scope: Scope) {
        super(seed.desc)
        this._scope = scope
        
        const meAsObserver = (newValue: V) => {
            if (newValue !== this._value) {
                this._value = newValue
                this._dispatcher.dispatch("change", newValue)
            }
        }
        scope(
            () => {
                const [newValue, unsub] = seed.subscribe(meAsObserver)
                this._value = newValue
                return unsub
            },
            this._dispatcher
        );
    }

    onChange(observer: Observer<V>) {
        return this._dispatcher.on("change", observer)
    }
    
    get(): V {
        return checkScope(this, this._value)
    }

    getScope() {
        return this._scope
    }
}

export function toPropertySeed<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A): PropertySeed<A>;
export function toPropertySeed<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B): PropertySeed<A | B>;
export function toPropertySeed(stream: EventStream<any> | EventStreamSeed<any>, initial: any): PropertySeed<any> {
    const forEach = (observer: Observer<any>): [any, Unsub] => {        
        return [initial, stream.forEach(observer)]
    }    
    return new PropertySeed(stream + `.toProperty(${initial})`, forEach)
}

export function toProperty<A>(stream: EventStream<A> | EventStreamSeed<A>, initial: A, scope: Scope): Property<A>;
export function toProperty<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B, scope: Scope): Property<A | B>;

export function toProperty(stream: EventStream<any> | EventStreamSeed<any>, initial: any, scope: Scope) {    
    return new StatefulProperty(toPropertySeed(stream, initial), scope);
}

export function constant<A>(value: A): Property<A> {
    return toProperty(never(), value, globalScope)
}