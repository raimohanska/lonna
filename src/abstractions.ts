import { Scope } from "./scope";
import { nop } from "./util";
export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Subscribe<V> = (observer: Observer<Event<V>>) => Unsub

export abstract class Event<V> {
    abstract type: string;
}

export class Value<V> extends Event<V> {
    type: string = "value"
    value: V
    constructor(value: V) {
        super()
        this.value = value
    }
}

export class End extends Event<any> {
    type: string = "end"
}
export type EventLike<V> = Event<V>[] | Event<V> | V

export type Unsub = Callback

export function toEvent<V>(value: Event<V> | V): Event<V> {
    if (value instanceof Event) {
        return value
    }
    return valueEvent(value)
}

export function toEvents<V>(value: EventLike<V>): Event<V>[] {
    if (value instanceof Array) {
        return value.map(toEvent)
    }
    return [toEvent(value)]
}

export function valueEvent<V>(value: V): Value<V> {
    return new Value(value)
}

export function isValue<V>(event: Event<V>): event is Value<V> {
    return event.type === "value"
}

export function isEnd<V>(event: Event<V>): event is End {
    return event.type === "end"
}

export function valueObserver<V>(observer: Observer<V>): Observer<Event<V>> {
    return event => { if (isValue(event)) observer(event.value) }
}

export const endEvent: End = new End()

// Abstract classes instead of interfaces for runtime type information and instanceof

export abstract class Observable<V> {
    desc: string

    constructor(desc: string) {
        this.desc = desc;
    }

    abstract subscribe(observer: Observer<Event<V>>): Unsub;

    forEach(observer: Observer<V>): Unsub {
        return this.subscribe(valueObserver(observer))
    }

    log(message?: string) {
        this.forEach(v => message === undefined ? console.log(v) : console.log(message, v))
    }
    toString(): string {
        return this.desc
    }
}

export abstract class ScopedObservable<V> extends Observable<V> {
    constructor(desc: string) {
        super(desc)
    }
    abstract getScope(): Scope;    
}

export type PropertySubscribe<V> = (observer: Observer<Event<V>>) => [V, Unsub]

export abstract class Property<V> extends ScopedObservable<V> {
    constructor(desc: string) {
        super(desc)
    }

    abstract get(): V

    abstract onChange(observer: Observer<Event<V>>): Unsub;

    subscribe(observer: Observer<Event<V>>): Unsub {        
        const unsub = this.onChange(observer)
        observer(valueEvent(this.get()))
        return unsub
    }    
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class PropertySeed<V> extends Observable<V> {
    private _consumed = false
    private _get: () => V

    subscribe: Subscribe<V>;
    get() {
        if (this._consumed) throw Error("PropertySeed consumed already")
        this._consumed = true
        return this._get()
    }

    constructor(desc: string, get: () => V, subscribe: Subscribe<V>) {
        super(desc)
        this._get = get;
        this.subscribe = subscribe;
    }
}

export abstract class EventStream<V> extends ScopedObservable<V> {
    constructor(desc: string) { 
        super(desc) 
    }
}

export class EventStreamSeed<V> extends Observable<V> {
    subscribe: (observer: Observer<Event<V>>) => Unsub

    constructor(desc: string, subscribe: Subscribe<V>) {
        super(desc)
        this.subscribe = subscribe
    }
}

export abstract class Atom<V> extends Property<V> {
    constructor(desc: string) { 
        super(desc) 
    }
    abstract set(newValue: V): void
    abstract modify(fn: (old: V) => V): void
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSeed<V> extends PropertySeed<V> {
    set: (updatedValue: V) => void;
    constructor(desc: string, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(desc, get, subscribe)
        this.set = set
    }
}

export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
}