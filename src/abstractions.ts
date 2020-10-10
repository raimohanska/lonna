import { Scope } from "./scope";
export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Unsub = Callback

// Abstract classes instead of interfaces for runtime type information and instanceof

export abstract class Observable<V> {
    readonly desc: string

    constructor(desc: string) {
        this.desc = desc;
    }

    abstract forEach(observer: Observer<V>): Unsub;

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

export type PropertySubscribe<V> = (observer: Observer<V>) => [V, Unsub]

export abstract class Property<V> extends ScopedObservable<V> {
    constructor(desc: string) {
        super(desc)
    }

    abstract get(): V

    abstract onChange(observer: Observer<V>): Unsub;

    subscribe(observer: Observer<V>): [V, Unsub] {
        const unsub = this.onChange(observer)
        return [this.get(), unsub]
    }

    forEach(observer: Observer<V>): Unsub {
        observer(this.get())
        return this.onChange(observer)
    }    
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class PropertySeed<V> extends Observable<V> {
    subscribe: PropertySubscribe<V>

    constructor(desc: string, subscribe: (observer: Observer<V>) => [V, Unsub]) {
        super(desc)
        this.subscribe = subscribe
    }

    forEach(observer: Observer<V>): Unsub {
        const [init, unsub] = this.subscribe(observer)
        observer(init)
        return unsub
    }
}

export abstract class EventStream<V> extends ScopedObservable<V> {
    constructor(desc: string) { 
        super(desc) 
    }
}

export class EventStreamSeed<V> extends Observable<V> {
    forEach: (observer: Observer<V>) => Unsub

    constructor(desc: string, forEach: (observer: Observer<V>) => Unsub) {
        super(desc)
        this.forEach = forEach
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
    constructor(desc: string, forEach: (observer: Observer<V>) => [V, Unsub], set: (updatedValue: V) => void) {
        super(desc, forEach)
        this.set = set
    }
}

export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
}