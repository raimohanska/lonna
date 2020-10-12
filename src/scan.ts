import { Event, EventStream, EventStreamSeed, isValue, Observer, Property, PropertySeed, valueEvent } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";

export function scan<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B, fn: (state: B, next: A) => B, scope: Scope): Property<B>;
export function scan<A, B>(stream: EventStream<A> | EventStreamSeed<A>, initial: B, fn: (state: B, next: A) => B): PropertySeed<B>;

export function scan<A, B>(seed: EventStream<A> | EventStreamSeed<A>, initial: B, fn: (state: B, next: A) => B, scope?: Scope): any {
    const source = seed.consume()
    let current = initial
    return applyScopeMaybe(new PropertySeed(source + `.scan(fn)`, () => initial, (observer: Observer<Event<B>>) => {
        const unsub = source.subscribe(event => {
            if (isValue(event)) {
                current = fn(current, event.value)
                observer(valueEvent(current))
            } else {
                observer(event)
            }
        })
        return unsub
    }), scope)
}