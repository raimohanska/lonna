import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event, Subscribe } from "./abstractions";
export interface MapOp<A, B> {
    (prop: Property<A>): Property<B>;
    (prop: PropertySeed<A>): PropertySeed<B>;
    (s: EventStream<A>): EventStream<B>;
    (s: EventStreamSeed<A>): EventStreamSeed<B>;
}
export declare function map<A, B>(fn: (value: A) => B): MapOp<A, B>;
export declare function map<A, B>(sampledProperty: Property<B>): MapOp<A, B>;
export declare function mapSubscribe<A, B>(subscribe: Subscribe<Event<A>>, fn: (value: A) => B): Subscribe<B>;
export declare function mapObserver<A, B>(observer: Observer<Event<B>>, fn: (value: A) => B): Observer<Event<A>>;
export declare function mapEvent<A, B>(event: Event<A>, fn: (value: A) => B): Event<B>;
