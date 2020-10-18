import { Atom, AtomSeed, EventStream, EventStreamSeed, Observable, Property, PropertySeed } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { changes } from "./changes"
import { Scope } from "./scope"
import { rename } from "./util"

export type EventStreamDelay<V> = (stream: EventStreamSeed<V>) => EventStreamSeed<V>

export function transformChanges<A>(desc: string, seed: AtomSeed<A> | Atom<A>, transformer: EventStreamDelay<A>): AtomSeed<A>
export function transformChanges<A>(desc: string, seed: AtomSeed<A> | Atom<A>, transformer: EventStreamDelay<A>, scope: Scope): Atom<A>
export function transformChanges<A>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: EventStreamDelay<A>): EventStreamSeed<A>
export function transformChanges<A>(desc: string, seed: Property<A> | PropertySeed<A>, transformer: EventStreamDelay<A>): PropertySeed<A>
export function transformChanges<A>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: EventStreamDelay<A>, scope: Scope): EventStream<A>
export function transformChanges<A>(desc: string, seed: Property<A> | PropertySeed<A>, transformer: EventStreamDelay<A>, scope: Scope): Property<A>
export function transformChanges<A>(desc: string, o: Observable<A>, transformer: EventStreamDelay<A>): Observable<A> // A generic signature. Note that the implementation is defined for the above cases only.

export function transformChanges<A, B>(desc: string, x: any, transformer: EventStreamDelay<A>, scope?: Scope): any {
    if (x instanceof EventStream || x instanceof EventStreamSeed) {
        return rename(desc, transformer(x as EventStreamSeed<A>)) // TODO: stream coerced into stream seed due to improper typing
    } else if (x instanceof Atom || x instanceof AtomSeed) {
        const source = x instanceof Property ? x : x.consume()
        return applyScopeMaybe(new AtomSeed(desc, () => source.get(), observer => {
            return transformer(changes(source as any as AtomSeed<A>)).consume().subscribe(observer) // TODO: AtomSource coerced into AtomSeed due to improper typing
        }, source.set))
    } else if (x instanceof Property || x instanceof PropertySeed) {
        const source = x instanceof Property ? x : x.consume()
        return applyScopeMaybe(new PropertySeed(desc, () => source.get(), observer => {
            return transformer(changes(source as any as PropertySeed<A>)).consume().subscribe(observer) // TODO: PropertySource coerced into PropertySeed due to improper typing
        }))
    } else {
        throw Error("Unknown observable " + x)
    }
}