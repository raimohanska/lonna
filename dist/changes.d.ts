import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
export declare function changes<O extends PropertySeed<any> | Property<any>>(property: O): O extends PropertySeed<infer A> ? EventStreamSeed<A> : O extends Property<infer A> ? EventStream<A> : never;
