import { Desc, endEvent, Event, EventStream, EventStreamSeed, isProperty, isPropertySource, isValue, Observable, ObservableSeed, Observer, Property, PropertySeed, Scope, Subscribe, Unsub, valueEvent } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { PropertySeedImpl } from "./property";
import { EventStreamSeedImpl } from "./eventstream";
import { nop, remove } from "./util";

export type FlatMapOptions = {
    latest?: boolean;
}

export type Spawner<A, O> = (value: A) => O

export interface FlatMapOp<A, B> {
    (s: EventStream<A> | EventStreamSeed<A>): EventStreamSeed<B>;
}
export interface FlatMapOpScoped<A, B> {
    (s: EventStream<A> | EventStreamSeed<A>): EventStream<B>;
}

export function flatMap<A, B>(fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>): FlatMapOp<A, B>;
export function flatMap<A, B>(fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, scope: Scope): FlatMapOpScoped<A, B>;

export function flatMap<A, B>(fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, scope?: Scope): any {
    return (s: EventStream<A> | EventStreamSeed<A>) => 
        applyScopeMaybe(new FlatMapStreamSeed(() => `${s}.flatMap(fn)`, s, fn, {}), scope)
}

export type FlatMapChild<B extends Observable<any>> = {
    observable: B,
    unsub?: Unsub;
}

export class FlatMapStreamSeed<A, B> extends EventStreamSeedImpl<B> {
    constructor(desc: Desc, s: EventStreamSeed<A>, fn: Spawner<A, EventStream<B> | EventStreamSeed<B>>, options: FlatMapOptions = {}) {
        const [children, subscribe] = flatMapSubscribe(s.consume().subscribe.bind(s), fn, options)
        super(desc, subscribe)
    }
}

export class FlatMapPropertySeed<A, B> extends PropertySeedImpl<B> {
    constructor(desc: Desc, src: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, options: FlatMapOptions = {}) {
        const source = isProperty(src) ? src : src.consume()
        let initializing = true // Flag used to prevent the initial value from leaking to the external subscriber. Yes, this is hack.
        const subscribeWithInitial = (onValue: Observer<A>, onEnd: Observer<void> = nop) => {
            const unsub = source.onChange(onValue, onEnd)
            onValue(source.get()) // To spawn property for initial value
            initializing = false
            return unsub
        }
        const [children, subscribe] = flatMapSubscribe(subscribeWithInitial, fn, options)
        const get = () => {
            if (children.length != 1) {
                throw Error("Unexpected child count: " + children.length)
            }
            const observable = children[0].observable
            if (isProperty(observable) || isPropertySource(observable)) {
                return (observable as Property<B>).get()
            } else {
                throw Error("Observable returned by the spawner function if flatMapLatest for Properties must return a Property. This one is not a Property: " + observable)
            }            
        }
        super(desc, get, (onValue, onEnd = nop) => subscribe(value => {
            if (!initializing) onValue(value)
        }, () => {
            if (!initializing) onEnd()
        }))
    }
}

function flatMapSubscribe<A, B>(subscribe: Subscribe<A>, fn: Spawner<A, ObservableSeed<B, Observable<B>>>, options: FlatMapOptions): [FlatMapChild<Observable<B>>[], Subscribe<B>] {
    const children: FlatMapChild<Observable<B>>[] = []
    return [children, (onValue: Observer<B>, onEnd: Observer<void> = nop) => {            
        let rootEnded = false
        const unsubThis = subscribe(rootEvent => {
            if (options.latest) {
                for (let child of children) {
                    child.unsub!()
                }
                children.splice(0)
            }
            const child = { observable: fn(rootEvent).consume() } as FlatMapChild<Observable<B>>
            children.push(child)
            let ended = false
            child.unsub = child.observable.subscribe(onValue, () => {
                remove(children, child)
                if (child.unsub) {                            
                    child.unsub()
                } else {
                    ended = true
                }
                if (children.length === 0 && rootEnded) {
                    onEnd()
                }
            })
            if (ended) {
                child.unsub()
            }
        }, () => {
            rootEnded = true
                
            if (children.length === 0) {
                onEnd()
            }
        })
        return () => {
            unsubThis()
            children.forEach(child => child.unsub && child.unsub())
        }
    }]
}