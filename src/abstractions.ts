import { Dispatcher } from "./dispatcher";
import { Pipeable } from "./pipeable";
import { toString } from "./tostring";

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

export function isObservableSeed<V, C extends Observable<any>, O extends ScopedObservable<any>>(e: any): e is ObservableSeed<V, C, O> { 
    return e._L !== undefined
}

export type Callback = () => void
export type Observer<V> = (value: V) => void
export type Subscribe<V> = (onValue: Observer<V>, onEnd?: Observer<void>) => Unsub
export type Unsub = Callback
export class Description {
    desc: Desc
    constructor(desc: Desc) {
        this.desc = desc
    }    
    toString(): string {
        if (typeof this.desc === "string") {
            return this.desc
        } else if (this.desc instanceof Description) {
            return this.desc.toString()
        } else if (this.desc.length == 2) {
            return `${toString(this.desc[0])}(${this.desc[1].map(toString).join(",")})`
        } else if (this.desc.length === 3) {
            return `${toString(this.desc[0])}.${this.desc[1]}(${this.desc[2].map(toString).join(",")})`
        } else {
            throw Error("Unexpected desc: " + toString(this.desc))
        }
    }
}
export type Desc = Description | DescWithContext | MethodDesc | string
export type MethodDesc = [string, any[]]
export type DescWithContext = [any, string, any[]] 
export function composeDesc(context: any, methodCall: MethodDesc): DescWithContext {
    const [method, args] = methodCall
    return [context, method, args]
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


export const endEvent: End = new End()

export function valueObserver<V>(observer: Observer<V>): Observer<Event<V>> {
    return event => { if (isValue(event)) observer(event.value) }
}

export interface ObservableIdentifiers {
    _L: TypeBitfield // Discriminator bitfield for detecting implemented interfaces runtime. Used by the is* methods above.
    desc: Description
    toString(): string;
}

export interface ForEach<V> {
    forEach(observer: Observer<V>): Unsub;
    log(message?: string): Unsub;
}

export type Observable<V> = ObservableIdentifiers & ForEach<V> & {
    subscribe(onValue: Observer<V>, onEnd?: Observer<void>): Unsub;
}

export interface ObservableSeed<V, C extends Observable<any>, O extends ScopedObservable<any>> extends Pipeable, ObservableIdentifiers, ForEach<V> {
    observableType(): string
    consume(): C;
    applyScope(scope: Scope): O
}

export type ScopedObservable<V> = Observable<V> & {
    getScope(): Scope;  
}

export interface PropertyMethods<V> {
    get(): V
    onChange(onValue: Observer<V>, onEnd?: Observer<void> | undefined): Unsub;
}

export type PropertySource<V> = Observable<V> & PropertySeed<V> & PropertyMethods<V> & {
    observableType(): "PropertySource" | "Property" | "AtomSource" | "Atom"    
}
export type Property<V> = ScopedObservable<V> & PropertySource<V> & PropertyMethods<V> & {
    observableType(): "Property" | "Atom"    
}
export type PropertySeed<V> = ObservableSeed<V, PropertySource<V>, Property<V>> & {
    observableType(): "PropertySeed" | "PropertySource" | "Property" | "AtomSeed" | "AtomSource" | "Atom"
}


export type EventStreamSource<V> = Observable<V> & EventStreamSeed<V> & {
    observableType(): "EventStreamSource" | "EventStream" | "Bus"
}
export type EventStream<V> = ScopedObservable<V> & EventStreamSource<V> & {
    observableType(): "EventStream" | "Bus"
}
export type EventStreamSeed<V> = ObservableSeed<V, EventStreamSource<V>, EventStream<V>> & {
    observableType(): "EventStreamSeed" | "EventStreamSource" | "EventStream" | "Bus"       
}


export type AtomSource<V> = PropertySource<V> & PropertySeed<V> & AtomSeed<V> & {
    observableType(): "AtomSource" | "Atom"
    set(updatedValue: V): void;
}
export type AtomSeed<V> = ObservableSeed<V, AtomSource<V>, Atom<V>> & {
    observableType(): "AtomSeed" | "AtomSource" | "Atom"
}

export type Atom<V> = Property<V> & AtomSource<V> & {
    observableType(): "Atom"
    set(newValue: V): void
    modify(fn: (old: V) => V): void
}

export interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
    end(): void
}

export type ScopeFn = (onIn: () => Unsub) => void;

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