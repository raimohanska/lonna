import { EventStream, EventStreamSeed, Observer, Property, PropertySeed, Event, Subscribe } from "./abstractions";
export declare type MapResult<A, B, O> = O extends Property<any> ? Property<B> : O extends PropertySeed<any> ? PropertySeed<B> : O extends EventStream<any> ? EventStream<B> : EventStreamSeed<B>;
export interface MapOp<A, B> {
    <O extends Property<A> | PropertySeed<A> | EventStream<A> | EventStreamSeed<A>>(o: O): MapResult<A, B, O>;
}
export declare function map<A, B>(fn: (value: A) => B): MapOp<A, B>;
export declare function map<A, B>(sampledProperty: Property<B>): MapOp<A, B>;
export declare function mapSubscribe<A, B>(subscribe: Subscribe<Event<A>>, fn: (value: A) => B): Subscribe<B>;
export declare function mapObserver<A, B>(observer: Observer<Event<B>>, fn: (value: A) => B): Observer<Event<A>>;
export declare function mapEvent<A, B>(event: Event<A>, fn: (value: A) => B): Event<B>;
