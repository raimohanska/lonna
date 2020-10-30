import { pipe } from "./pipe";
import { Dispatcher } from "./dispatcher";
export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Subscribe<V> = (observer: Observer<Event<V>>) => Unsub

type TypeBitfield = number

const T_OBSERVABLE = 0x0001;
const T_SEED = 0x0002;
const T_SOURCE = 0x0004;
const T_PROPERTY = 0x0010;
const T_STREAM = 0x0020;
const T_ATOM = 0x0050; // atoms are always properties

const T_EVENT = 0x0100
const T_SCOPE = 0x0200
const T_VALUE = 0x1100
const T_END = 0x2100

function matchFlags(o: any, flags: TypeBitfield) {
    return (o._L & flags) === flags
}

export function isProperty<V>(e: any): e is Property<V> { return matchFlags(e, T_OBSERVABLE | T_PROPERTY) }
export function isPropertySeed<V>(e: any): e is PropertySeed<V> { return matchFlags(e, T_SEED | T_PROPERTY) }
export function isPropertySource<V>(e: any): e is PropertySource<V> { return matchFlags(e, T_SOURCE | T_PROPERTY) }
export function isEventStream<V>(e: any): e is EventStream<V> { return matchFlags(e, T_OBSERVABLE | T_STREAM) }
export function isEventStreamSeed<V>(e: any): e is EventStreamSeed<V> { return matchFlags(e, T_SEED | T_STREAM) }
export function isEventStreamSource<V>(e: any): e is EventStreamSeed<V> { return matchFlags(e, T_SOURCE | T_STREAM) }
export function isAtom<V>(e: any): e is Atom<V> { return matchFlags(e, T_OBSERVABLE | T_ATOM) }
export function isAtomSeed<V>(e: any): e is AtomSeed<V> { return matchFlags(e, T_SEED | T_ATOM) }
export function isAtomSource<V>(e: any): e is AtomSeed<V> { return matchFlags(e, T_SOURCE | T_ATOM) }

export function isObservableSeed<V, O extends Observable<any>>(e: any): e is ObservableSeed<V, O> { 
    return e._L !== undefined
}

export abstract class Event<V> {
    _L: TypeBitfield = T_EVENT
}

export class Value<V> extends Event<V> {
    _L: TypeBitfield = T_VALUE
    value: V
    constructor(value: V) {
        super()
        this.value = value
    }
}

export class End extends Event<any> {
    _L: TypeBitfield = T_END
}
export type EventLike<V> = Event<V>[] | Event<V> | V

export type Unsub = Callback

export function toEvent<V>(value: Event<V> | V): Event<V> {
    if (isEvent<V>(value)) {
        return value
    }
    return valueEvent(value)
}

export function isEvent<V>(value: any): value is Event<V> {
    return matchFlags(value, T_EVENT)
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
    return matchFlags(event, T_VALUE)
}

export function isEnd<V>(event: Event<V>): event is End {
    return matchFlags(event, T_END)
}

export function valueObserver<V>(observer: Observer<V>): Observer<Event<V>> {
    return event => { if (isValue(event)) observer(event.value) }
}

export const endEvent: End = new End()

export class Pipeable {
    pipe<A>( a2b: (a: this) => A): A
    pipe<A, B>( a2b: (a: this) => A, b2c: (a: A) => B): B
    pipe<A, B, C>( a2b: (a: this) => A, b2c: (a: A) => B, c2d: (b: B) => C): C
    pipe<A, B, C, D>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
    ): D
    pipe<A, B, C, D, E>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
    ): E
    pipe<A, B, C, D, E, F>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
    ): F
    pipe<A, B, C, D, E, F, G>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
    ): G
    pipe<A, B, C, D, E, F, G, H>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
    ): H
    pipe<A, B, C, D, E, F, G, H, I>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
      i2j: (h: H) => I,
    ): I
    pipe<A, B, C, D, E, F, G, H, I, J>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
      i2j: (h: H) => I,
      j2k: (i: I) => J,
    ): J    
    pipe(...args: any): any {
        return pipe(this, ...(args as [any]))
    }
}

export abstract class ObservableSeed<V, O extends Observable<any>> extends Pipeable {
    abstract _L: TypeBitfield
    desc: string

    constructor(desc: string) {
        super()
        this.desc = desc
    }

    abstract consume(): O;

    toString(): string {
        return this.desc
    }

    forEach(observer: Observer<V>): Unsub {
        return this.consume().subscribe(valueObserver(observer))
    }

    log(message?: string) {
        this.forEach(v => message === undefined ? console.log(v) : console.log(message, v))
    }
}

export abstract class ObservableSeedImpl<V, O extends Observable<any>> extends ObservableSeed<V, O> {
    private _source: O | null

    constructor(source: O) {
        super(source.desc)
        this._source = source
    }

    consume(): O {
        if (this._source === null) throw Error(`Seed ${this.desc} already consumed`)
        const result = this._source
        this._source = null
        return result
    }
}

export abstract class Observable<V> extends ObservableSeed<V, Observable<V>> {
    abstract _L: TypeBitfield
    constructor(desc: string) {
        super(desc)
    }

    abstract subscribe(observer: Observer<Event<V>>): Unsub;

    forEach(observer: Observer<V>): Unsub {
        return this.subscribe(valueObserver(observer))
    }

    consume() {
        return this
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
    _L: TypeBitfield = T_PROPERTY | T_OBSERVABLE | T_SEED

    constructor(desc: string) {
        super(desc)
    }

    abstract get(): V

    abstract onChange(observer: Observer<Event<V>>): Unsub;

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call
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
export class PropertySeed<V> extends ObservableSeedImpl<V, PropertySource<V>> {
    _L: TypeBitfield = T_PROPERTY | T_SEED
    constructor(desc: string, get: () => V, onChange: Subscribe<V>) {
        super(new PropertySource(desc, get, onChange))
    }  
}

// TODO: Property should be PropertySource too
export class PropertySource<V> extends Observable<V> {
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

export abstract class EventStream<V> extends ScopedObservable<V> {
    _L: TypeBitfield = T_STREAM | T_OBSERVABLE | T_SEED
    constructor(desc: string) { 
        super(desc) 
    }
}

export class EventStreamSeed<V> extends ObservableSeedImpl<V, EventStreamSource<V>> {
    _L: TypeBitfield = T_STREAM | T_SEED
    constructor(desc: string, subscribe: Subscribe<V>) {
        super(new EventStreamSource(desc, subscribe))
    }
}

export class EventStreamSource<V> extends Observable<V> {
    _L: TypeBitfield = T_STREAM | T_SOURCE
    subscribe: (observer: Observer<Event<V>>) => Unsub

    constructor(desc: string, subscribe: Subscribe<V>) {
        super(desc)
        this.subscribe = subscribe
    }
}

export abstract class Atom<V> extends Property<V> implements ObservableSeed<V, Atom<V>> {
    _L: TypeBitfield = T_ATOM | T_OBSERVABLE | T_SEED
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
export class AtomSeed<V> extends ObservableSeedImpl<V, AtomSource<V>>{
    _L: TypeBitfield = T_ATOM | T_SEED
    constructor(desc: string, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(new AtomSource(desc, get, subscribe, set))
    }  
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSource<V> extends PropertySource<V> {
    _L: TypeBitfield = T_ATOM | T_SOURCE
    set: (updatedValue: V) => void;
    constructor(desc: string, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(desc, get, subscribe)
        this.set = set
    }
}

export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
    end(): void
}


/**
 *  Defines the active lifetime of an Observable. You can use 
 *  - globalScope: the observable will stay active forever, connected to its underlying data sources
 *  - autoScope: the observable will be active as long as it has observers (will throw if trying to re-activate)
 *  - custom scopes for, e.g. component lifetimes (between mount/unmount)
 **/ 
export type ScopeFn = (onIn: () => Unsub, dispatcher: Dispatcher<any>) => void;

export class Scope {
    _L: TypeBitfield = T_SCOPE
    subscribe: ScopeFn
    constructor(fn: ScopeFn) {
        this.subscribe = fn
    }
}

export function isScope(x: any): x is Scope {
    return matchFlags(x, T_SCOPE)
}

export type Function0<R> = () => R;
export type Function1<T1, R> = (t1: T1) => R;
export type Function2<T1, T2, R> = (t1: T1, t2: T2) => R;
export type Function3<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
export type Function4<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
export type Function5<T1, T2, T3, T4, T5, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R;
export type Function6<T1, T2, T3, T4, T5, T6, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R;