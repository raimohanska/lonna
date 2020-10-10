import { Scope } from "./scope";
export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Event<V> = Value<V> | End
export type Value<V> = { type: "value", value: V }
export type End = { type: "end" }
export type Unsub = Callback

export function valueEvent<V>(value: V): Value<V> {
    return { type: "value", value }
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

export const endEvent: End = { type: "end" }

// Abstract classes instead of interfaces for runtime type information and instanceof

export abstract class Observable<V> {
    readonly desc: string

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

    subscribeWithInitial(observer: Observer<Event<V>>): [V, Unsub] {
        const unsub = this.onChange(observer)
        return [this.get(), unsub]
    }

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
    subscribeWithInitial: PropertySubscribe<V>

    constructor(desc: string, subscribeWithInitial: (observer: Observer<Event<V>>) => [V, Unsub]) {
        super(desc)
        this.subscribeWithInitial = subscribeWithInitial
    }

    subscribe(observer: Observer<Event<V>>): Unsub {
        const [init, unsub] = this.subscribeWithInitial(observer)
        observer(valueEvent(init))
        return unsub
    }
}

export abstract class EventStream<V> extends ScopedObservable<V> {
    constructor(desc: string) { 
        super(desc) 
    }
}

export class EventStreamSeed<V> extends Observable<V> {
    subscribe: (observer: Observer<Event<V>>) => Unsub

    constructor(desc: string, subscribe: (observer: Observer<Event<V>>) => Unsub) {
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
    constructor(desc: string, subscribe: (observer: Observer<Event<V>>) => [V, Unsub], set: (updatedValue: V) => void) {
        super(desc, subscribe)
        this.set = set
    }
}

export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
}