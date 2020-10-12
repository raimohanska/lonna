import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event, isValue, valueEvent } from "./abstractions";
import { StatelessEventStream } from "./eventstream";
import { StatelessProperty } from "./property";

export function map<A, B>(prop: Property<A>, fn: (value: A) => B): Property<B>;
export function map<A, B>(prop: PropertySeed<A>, fn: (value: A) => B): PropertySeed<B>;
export function map<A, B>(s: EventStream<A>, fn: (a: A) => B): EventStream<B>;
export function map<A, B>(s: EventStream<A>, sampledProperty: Property<B>): EventStream<B>;
export function map<A, B>(s: EventStreamSeed<A>, fn: (a: A) => B): EventStreamSeed<B>;
export function map<A, B>(s: EventStreamSeed<A>, sampledProperty: Property<B>): EventStreamSeed<B>;

export function map<A, B>(o: any, x: ((value: A) => B) | Property<B>): any {
    const desc = o + `.map(fn)`;
    const fn = (x instanceof Property) ? () => x.get() : x
    if (o instanceof EventStream) {
        return new StatelessEventStream(desc, observer => o.subscribe(mapObserver(observer, fn)), o.getScope())
    } else if (o instanceof EventStreamSeed) {
        const source = o.consume()
        return new EventStreamSeed(desc, observer => source.subscribe(mapObserver(observer, fn)))
    } else if (o instanceof Property) {
        return new StatelessProperty(desc, () => fn(o.get()), observer => o.onChange(mapObserver(observer, fn)), o.getScope())
    } else if (o instanceof PropertySeed) {
        const source = o.consume()
        return new PropertySeed(desc, () => fn(source.get()), observer => {
            return source.onChange(mapObserver(observer, fn))            
        })    
    }
    throw Error("Unknown observable")
}

export function mapObserver<A, B>(observer: Observer<Event<B>>, fn: (value: A) => B): Observer<Event<A>> {
    return (event: Event<A>) => observer(mapEvent(event, fn))
}

export function mapEvent<A, B>(event: Event<A>, fn: (value: A) => B): Event<B> {
    if (isValue(event)) {
        return valueEvent(fn(event.value))
    } else {
        return event
    }
}