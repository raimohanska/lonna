import { Event, EventStream, EventStreamSeed, Observer, Property, PropertySeed } from "./abstractions";
import { StatelessEventStream } from "./eventstream";

export function changes<T>(property: Property<T>): EventStream<T>
export function changes<T>(property: PropertySeed<T>): EventStreamSeed<T>
export function changes<T>(property: PropertySeed<T> | Property<T>): EventStreamSeed<T> | EventStream<T>

export function changes<T>(property: Property<T> | PropertySeed<T>): EventStream<T> | EventStreamSeed<T> {
    const desc = property + ".changes"
    const sub = (observer: Observer<Event<T>>) => {
        return property.onChange(observer)
    }
    if (property instanceof Property) {
        return new StatelessEventStream(desc, sub, property.getScope())
    } else {
        return new EventStreamSeed(desc, sub)
    }
}