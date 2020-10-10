import { EventStream, EventStreamSeed, Observer, Property, PropertySeed } from "./abstractions";
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
        return new StatelessEventStream(desc, observer => o.forEach(mapObserver(observer, fn)), o.getScope())
    } else if (o instanceof EventStreamSeed) {
        return new EventStreamSeed(desc, observer => o.forEach(mapObserver(observer, fn)))
    } else if (o instanceof Property) {
        return new StatelessProperty(desc, () => fn(o.get()), observer => o.onChange(mapObserver(observer, fn)), o.getScope())
    } else if (o instanceof PropertySeed) {
        return new PropertySeed(desc, observer => {
            const [value, unsub] = o.subscribe(mapObserver(observer, fn))        
            return [fn(value), unsub]
        })    
    }
    throw Error("Unknown observable")
}

export function mapObserver<A, B>(observer: Observer<B>, fn: (value: A) => B): Observer<A> {
    return (value: A) => observer(fn(value))
}