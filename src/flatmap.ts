import { endEvent, Event, EventStream, EventStreamSeed, isValue, Observable, ObservableSeed, Observer, Property, PropertySeed, PropertySource, Subscribe, Unsub, valueEvent } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { remove } from "./util";

export type FlatMapOptions = {
    latest?: boolean;
}

export type Spawner<A, O> = (value: A) => O

export function flatMap<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, EventStreamSeed<B>>): EventStreamSeed<B>;
export function flatMap<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, EventStreamSeed<B>>, scope: Scope): EventStream<B>;

export function flatMap<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, EventStreamSeed<B>>, scope?: Scope): any {
    return applyScopeMaybe(new FlatMapStreamSeed(`${s}.flatMap(fn)`, s as EventStreamSeed<A>, fn, {}), scope) // TODO: type coercion. EventStream should implement Seed (but now impossible because of inheritance)
}

export type FlatMapChild<B extends Observable<any>> = {
    observable: B,
    unsub?: Unsub;
}

export class FlatMapStreamSeed<A, B> extends EventStreamSeed<B> {
    constructor(desc: string, s: EventStreamSeed<A>, fn: Spawner<A, EventStreamSeed<B>>, options: FlatMapOptions = {}) {
        const [children, subscribe] = flatMapSubscribe(s.consume().subscribe.bind(s), fn, options)
        super(desc, subscribe)
    }
}

export class FlatMapPropertySeed<A, B> extends PropertySeed<B> {
    constructor(desc: string, src: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, options: FlatMapOptions = {}) {
        const source = src instanceof Property ? src : src.consume()
        let initializing = true // Flag used to prevent the initial value from leaking to the external subscriber. Yes, this is hack.
        const subscribeWithInitial = (observer: Observer<Event<A>>) => {
            const unsub = source.onChange(observer)
            observer(valueEvent(source.get())) // To spawn property for initial value
            initializing = false
            return unsub
        }
        const [children, subscribe] = flatMapSubscribe(subscribeWithInitial, fn, options)
        const get = () => {
            if (children.length != 1) {
                throw Error("Unexpected child count: " + children.length)
            }
            return (children[0].observable as PropertySource<B>).get()
        }
        super(desc, get, observer => subscribe(value => {
            if (!initializing) observer(value)
        }))
    }
}

function flatMapSubscribe<A, B>(subscribe: Subscribe<A>, fn: Spawner<A, ObservableSeed<Observable<B>>>, options: FlatMapOptions): [FlatMapChild<Observable<B>>[], Subscribe<B>] {
    const children: FlatMapChild<Observable<B>>[] = []
    return [children, (observer: Observer<Event<B>>) => {            
        let rootEnded = false
        const unsubThis = subscribe(rootEvent => {
            if (isValue(rootEvent)) {
                if (options.latest) {
                    for (let child of children) {
                        child.unsub!()
                    }
                    children.splice(0)
                }
                const child = { observable: fn(rootEvent.value).consume() } as FlatMapChild<Observable<B>>
                children.push(child)
                let ended = false
                child.unsub = child.observable.subscribe(childEvent => {
                    if (isValue(childEvent)) {
                        observer(childEvent)
                    } else {
                        remove(children, child)
                        if (child.unsub) {                            
                            child.unsub()
                        } else {
                            ended = true
                        }
                        if (children.length === 0 && rootEnded) {
                            observer(endEvent)
                        }
                    }
                })
                if (ended) {
                    child.unsub()
                }
            } else {
                rootEnded = true
                
                if (children.length === 0) {
                    observer(endEvent)
                }
            }
        })
        return () => {
            unsubThis()
            children.forEach(child => child.unsub && child.unsub())
        }
    }]
}