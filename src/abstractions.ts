import { Dispatcher } from "./dispatcher";
import { Pipeable } from "./pipeable";

export type TypeBitfield = number

export const T_SCOPED = 0x0007; // scoped observables always implement seed and source interfaces as well
export const T_SEED = 0x0002;
export const T_SOURCE = 0x0004;
export const T_PROPERTY = 0x0010;
export const T_STREAM = 0x0020;
export const T_ATOM = 0x0050; // atoms are always properties

export const T_EVENT = 0x0100
export const T_SCOPE = 0x0200
export const T_VALUE = 0x1100
export const T_END = 0x2100

export function matchFlags(o: any, flags: TypeBitfield) {
    if (!o) return false
    return (o._L & flags) === flags
}

export function isProperty<V>(e: any): e is Property<V> { return matchFlags(e, T_SCOPED | T_PROPERTY) }
export function isPropertySeed<V>(e: any): e is PropertySeed<V> { return matchFlags(e, T_SEED | T_PROPERTY) }
export function isPropertySource<V>(e: any): e is PropertySource<V> { return matchFlags(e, T_SOURCE | T_PROPERTY) }
export function isEventStream<V>(e: any): e is EventStream<V> { return matchFlags(e, T_SCOPED | T_STREAM) }
export function isEventStreamSeed<V>(e: any): e is EventStreamSeed<V> { return matchFlags(e, T_SEED | T_STREAM) }
export function isEventStreamSource<V>(e: any): e is EventStreamSeed<V> { return matchFlags(e, T_SOURCE | T_STREAM) }
export function isAtom<V>(e: any): e is Atom<V> { return matchFlags(e, T_SCOPED | T_ATOM) }
export function isAtomSeed<V>(e: any): e is AtomSeed<V> { return matchFlags(e, T_SEED | T_ATOM) }
export function isAtomSource<V>(e: any): e is AtomSeed<V> { return matchFlags(e, T_SOURCE | T_ATOM) }

export function isObservableSeed<V, O extends Observable<any>>(e: any): e is ObservableSeed<V, O> { 
    return e._L !== undefined
}

export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Subscribe<V> = (observer: Observer<Event<V>>) => Unsub

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

export interface ObservableSeed<V, O extends Observable<any>> extends Pipeable {
    _L: TypeBitfield // Discriminator bitfield for detecting implemented interfaces runtime. Used by the is* methods above.

    desc: string

    consume(): O;

    toString(): string;

    forEach(observer: Observer<V>): Unsub;

    log(message?: string): Unsub;
}


export interface Observable<V> {
    _L: TypeBitfield
    subscribe(observer: Observer<Event<V>>): Unsub;
    desc: string
}


export interface ScopedObservable<V> extends Observable<V> {
    getScope(): Scope;  
}

export type PropertySubscribe<V> = (observer: Observer<Event<V>>) => [V, Unsub]

export interface Property<V> extends ScopedObservable<V>, PropertySource<V> {
    get(): V
    onChange(observer: Observer<Event<V>>): Unsub;
}


/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export interface PropertySeed<V> extends ObservableSeed<V, PropertySource<V>> {
 
}


export type PropertySource<V> = Observable<V> & PropertySeed<V> & {
    onChange(observer: Observer<Event<V>>): Unsub
    get(): V 
}


export interface EventStream<V> extends ScopedObservable<V>, EventStreamSource<V> {
}

export interface EventStreamSeed<V> extends ObservableSeed<V, EventStreamSource<V>> {
    
}

export type EventStreamSource<V> = Observable<V> & EventStreamSeed<V>

export type AtomSeed<V> = ObservableSeed<V, AtomSource<V>>

export type Atom<V> = Property<V> & AtomSource<V> & {
    set(newValue: V): void
    modify(fn: (old: V) => V): void
}

/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export type AtomSource<V> = PropertySource<V> & PropertySeed<V> & AtomSeed<V> & {
    set(updatedValue: V): void;
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