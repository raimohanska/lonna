import { EventStream, Property } from "./abstractions";
export declare function sampledBy<A>(prop: Property<A>, sampler: EventStream<any>): EventStream<A>;
