import { EventStream, Property } from "./abstractions";
export declare function sampledBy<A>(sampler: EventStream<any>): (prop: Property<A>) => EventStream<A>;
