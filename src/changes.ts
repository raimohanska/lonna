import { Event, EventStream, EventStreamSeed, EventStreamSource, isProperty, Observer, Property, PropertySeed } from "./abstractions";
import { StatelessEventStream } from "./eventstream";
import { EventStreamSeedImpl } from "./eventstream";

export function changes<O extends PropertySeed<any> | Property<any>>(property: O): O extends PropertySeed<infer A> ? EventStreamSeed<A> : O extends Property<infer A> ? EventStream<A>: never;

export function changes<T>(property: Property<T> | PropertySeed<T>): EventStream<T> | EventStreamSeed<T> {
    const desc = property + ".changes"
    const source = property.consume()
    const sub = (observer: Observer<Event<T>>) => {
        return source.onChange(observer)
    }
    if (isProperty<T>(source)) {
        return new StatelessEventStream(desc, sub, source.getScope())
    } else {
        return new EventStreamSeedImpl(desc, sub)
    }
}