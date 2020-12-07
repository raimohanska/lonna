import { Event, EventLike, EventStream, EventStreamSeed, isEnd, isValue, Observer, Scope, Subscribe, toEvents, Unsub } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { EventStreamSeedImpl } from "./eventstream"

export function fromSubscribe<V>(subscribe: Subscribe<V>): EventStreamSeed<V>;
export function fromSubscribe<V>(subscribe: Subscribe<V>, scope: Scope): EventStream<V>;
export function fromSubscribe<V>(subscribe: Subscribe<V>, scope?: Scope): EventStream<V> | EventStreamSeed<V> {
    return applyScopeMaybe(new EventStreamSeedImpl("fromSubscribe(fn)", subscribe), scope)
}

export type FlexibleObserver<V> = (event: EventLike<V>) => void
export type FlexibleSubscribe<V> = (observer: FlexibleObserver<V>) => Unsub

export function toFlexibleObserver<V>(onValue: Observer<V>, onEnd: Observer<void>): FlexibleObserver<V> {
    return (eventLike: EventLike<V>) => {
        const events = toEvents(eventLike)
        for (const event of events) {
            if (isValue(event)) {
                onValue(event.value)
            } else {
                onEnd()
                return
            }
        }
    }
}

export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>): EventStreamSeed<V>;
export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>, scope: Scope): EventStream<V>;
export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>, scope?: Scope): EventStream<V> | EventStreamSeed<V> {
    return applyScopeMaybe(new EventStreamSeedImpl("fromSubscribe(fn)", (onValue, onEnd) =>
        subscribe(toFlexibleObserver(onValue, onEnd))
    ), scope)
}