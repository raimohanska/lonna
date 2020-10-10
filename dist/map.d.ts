import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event } from "./abstractions";
export declare function map<A, B>(prop: Property<A>, fn: (value: A) => B): Property<B>;
export declare function map<A, B>(prop: PropertySeed<A>, fn: (value: A) => B): PropertySeed<B>;
export declare function map<A, B>(s: EventStream<A>, fn: (a: A) => B): EventStream<B>;
export declare function map<A, B>(s: EventStream<A>, sampledProperty: Property<B>): EventStream<B>;
export declare function map<A, B>(s: EventStreamSeed<A>, fn: (a: A) => B): EventStreamSeed<B>;
export declare function map<A, B>(s: EventStreamSeed<A>, sampledProperty: Property<B>): EventStreamSeed<B>;
export declare function mapObserver<A, B>(observer: Observer<Event<B>>, fn: (value: A) => B): Observer<Event<A>>;
export declare function mapEvent<A, B>(event: Event<A>, fn: (value: A) => B): Event<B>;
