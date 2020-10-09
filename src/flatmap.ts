import { Atom, AtomSeed, EventStream, EventStreamSeed, Observer, Property, PropertySeed, Unsub } from "./abstractions";
import { applyScope, applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { transform, Transformer } from "./transform";

export type Spawner<A, B> = (value: A) => (EventStreamSeed<B> | EventStream<B>)
export function flatMap<A, B>(s: EventStream<A>, fn: Spawner<A, B>): EventStream<B>;
export function flatMap<A, B>(s: EventStreamSeed<A>, fn: Spawner<A, B>, scope?: Scope): EventStreamSeed<B>;

export function flatMap<A, B>(s: EventStreamSeed<A> | EventStreamSeed<A>, fn: (value: A) => EventStreamSeed<B>, scope?: Scope): any {
    if (s instanceof EventStream) {
        scope = s.scope()
    }
    return applyScopeMaybe(new EventStreamSeed<B>(`${s}.flatMap(fn)`, observer => {
        const children: Unsub[] = []
        const unsubThis = s.forEach(value => {
            const child = fn(value)
            children.push(child.forEach(observer))
        })
        return () => {
            unsubThis()
            children.forEach(f => f())
        }
    }))
}