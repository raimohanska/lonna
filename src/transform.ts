import { Event, Atom, AtomSeed, EventStream, EventStreamSeed, Observable, Observer, Property, PropertySeed, PropertySubscribe } from "./abstractions"
import { applyScope, applyScopeMaybe } from "./applyscope"
import { atom } from "./atom"
import { Scope } from "./scope"

export type Transformer<A, B> = {
    changes: (event: Event<A>, observer: Observer<Event<B>>) => void;
    init: (value: A) => B;
}

export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>): EventStreamSeed<B>
export function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>): PropertySeed<B>
export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>, scope: Scope): EventStream<B>
export function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>, scope: Scope): Property<B>
export function transform<A>(desc: string, seed: AtomSeed<A> | Atom<A>, transformer: Transformer<A, A>): AtomSeed<A>
export function transform<A, B>(desc: string, o: Observable<A>, transformer: Transformer<A, B>): Observable<B> // A generic signature. Note that the implementation is defined for the above cases only.

export function transform<A, B>(desc: string, x: any, transformer: Transformer<A, B>, scope?: Scope): any {
    if (x instanceof EventStream || x instanceof EventStreamSeed) {
        return applyScopeMaybe(new EventStreamSeed(desc, observer => x.subscribe((value: Event<A>) => transformer.changes(value, observer))))
    } else if (x instanceof Atom || x instanceof AtomSeed) {
        return applyScopeMaybe(new AtomSeed(desc, transformSubscribe(x, transformer), newValue => x.set(newValue)))
    } else if (x instanceof Property || x instanceof PropertySeed) {
        return applyScopeMaybe(new PropertySeed(desc, transformSubscribe(x, transformer)))
    } else {
        throw Error("Unknown observable " + x)
    }
}

function transformSubscribe<A, B>(src: { subscribeWithInitial: PropertySubscribe<A> }, transformer: Transformer<A, B>): PropertySubscribe<B> {
    if (src === undefined) throw Error("Assertion failed")
    return (observer: Observer<Event<B>>) => {
        const [initial, unsub] = src.subscribeWithInitial(value => transformer.changes(value, observer))
        return [transformer.init(initial), unsub]
    }
}
