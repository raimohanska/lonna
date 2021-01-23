import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event, isValue, valueEvent, AtomSeed, Subscribe, isProperty, isEventStream, isEventStreamSeed, isPropertySeed, Desc } from "./abstractions";
import { cached } from "./cached";
import { StatelessEventStream } from "./eventstream";
import { EventStreamSeedImpl } from "./eventstream";
import { PropertySeedImpl } from "./property";
import { StatelessProperty } from "./property";

export type MapResult<A, B, O> = O extends Property<any> 
    ? Property<B>
    : O extends PropertySeed<any>
        ? PropertySeed<B>
        : O extends EventStream<any>
            ? EventStream<B>
            : EventStreamSeed<B>;

export interface MapOp<A, B> {
    <O extends Property<A> | PropertySeed<A> | EventStream<A> | EventStreamSeed<A>>(o: O): MapResult<A, B, O>
}
export function map<A, B>(fn: (value: A) => B): MapOp<A, B>
export function map<A, B>(sampledProperty: Property<B>): MapOp<A, B>
export function map<A, B>(x: ((value: A) => B) | Property<B>): any {
    return (o: any) => {
        const desc = [o, "map", [x]] as Desc
        let fn = isProperty(x) ? () => x.get() : x
        if (isEventStream<A>(o)) {
            return new StatelessEventStream(desc, mapSubscribe(o.subscribe.bind(o), fn), o.getScope())
        } else if (isEventStreamSeed<A>(o)) {
            const source = o.consume()
            return new EventStreamSeedImpl(desc, mapSubscribe(source.subscribe.bind(source), fn))
        } else if (isProperty<A>(o)) {
            fn = cached(fn)
            return new StatelessProperty(desc, () => fn(o.get()), mapSubscribe(o.onChange.bind(o), fn), o.getScope())
        } else if (isPropertySeed<A>(o)) {
            const source = o.consume()
            fn = cached(fn)
            return new PropertySeedImpl(desc, () => fn(source.get()), mapSubscribe(source.onChange.bind(source), fn))    
        }
        throw Error("Unknown observable")    
    }
}

export function mapSubscribe<A, B>(subscribe: Subscribe<A>, fn: (value: A) => B): Subscribe<B> {
    return (onValue, onEnd) => subscribe(mapObserver(onValue, fn), onEnd)
}

export function mapObserver<A, B>(observer: Observer<B>, fn: (value: A) => B): Observer<A> {
    return (event: A) => observer(fn(event))
}

export function mapEvent<A, B>(event: Event<A>, fn: (value: A) => B): Event<B> {
    if (isValue(event)) {
        return valueEvent(fn(event.value))
    } else {
        return event
    }
}