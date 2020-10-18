import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event, isValue, valueEvent, AtomSeed, Subscribe } from "./abstractions";
import { StatelessEventStream } from "./eventstream";
import { StatelessProperty } from "./property";

export interface MapOp<A, B> {
    (prop: Property<A>): Property<B>;
    (prop: PropertySeed<A>): PropertySeed<B>;
    (s: EventStream<A>): EventStream<B>;
    (s: EventStreamSeed<A>): EventStreamSeed<B>;    
}
export function map<A, B>(fn: (value: A) => B): MapOp<A, B>
export function map<A, B>(sampledProperty: Property<B>): MapOp<A, B>
export function map<A, B>(x: ((value: A) => B) | Property<B>): any {
    return (o: any) => {
        const desc = o + `.map(fn)`;
        const fn = (x instanceof Property) ? () => x.get() : x
        if (o instanceof EventStream) {
            return new StatelessEventStream(desc, mapSubscribe(o.subscribe.bind(o), fn), o.getScope())
        } else if (o instanceof EventStreamSeed) {
            const source = o.consume()
            return new EventStreamSeed(desc, mapSubscribe(source.subscribe.bind(source), fn))
        } else if (o instanceof Property) {
            return new StatelessProperty(desc, () => fn(o.get()), mapSubscribe(o.onChange.bind(o), fn), o.getScope())
        } else if (o instanceof PropertySeed || o instanceof AtomSeed) {
            const source = o.consume()
            return new PropertySeed(desc, () => fn(source.get()), mapSubscribe(source.onChange.bind(source), fn))    
        }
        throw Error("Unknown observable")    
    }
}

export function mapSubscribe<A, B>(subscribe: Subscribe<Event<A>>, fn: (value: A) => B): Subscribe<B> {
    return observer => subscribe(mapObserver(observer, fn))
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