import { Event, Atom, AtomSeed, EventStream, EventStreamSeed, Observer, Property, PropertySeed, isValue } from "./abstractions";
import { applyScope, applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { transform, Transformer } from "./transform";

export type Predicate<A> = (value: A) => boolean

export function filter<A>(prop: Atom<A> | AtomSeed<A>, fn: Predicate<A>): AtomSeed<A>;
export function filter<A>(prop: Atom<A> | AtomSeed<A>, fn: Predicate<A>, scope: Scope): Atom<A>;
export function filter<A>(prop: Property<A> | PropertySeed<A>, fn: Predicate<A>): PropertySeed<A>;
export function filter<A>(prop: Property<A> | PropertySeed<A>, fn: Predicate<A>, scope: Scope): Property<A>;
export function filter<A>(s: EventStream<A>, fn: Predicate<A>): EventStream<A>;
export function filter<A>(s: EventStreamSeed<A>, fn: Predicate<A>): EventStreamSeed<A>;

export function filter<A>(s: any, fn: Predicate<A>, scope?: Scope): any {
    return applyScopeMaybe(transform(s + `.map(fn)`, s, filterT(fn)), scope)
}

function filterT<A>(fn: Predicate<A>): Transformer<A, A> {
    return {
        changes: (event: Event<A>, observer: Observer<Event<A>>) => {
            if (isValue(event)) {
                if (fn(event.value)) {
                    observer(event)
                }
            } else {
                observer(event)
            }
        },
        init: (value: A) => {
            if (!fn(value)) {
                throw Error(`Initial value not matching filter`)
            }
            return value
        }
    }
}