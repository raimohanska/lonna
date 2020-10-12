import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
export declare function changes<T>(property: Property<T>): EventStream<T>;
export declare function changes<T>(property: PropertySeed<T>): EventStreamSeed<T>;
export declare function changes<T>(property: PropertySeed<T> | Property<T>): EventStreamSeed<T> | EventStream<T>;
