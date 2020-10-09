import { EventStream, Property } from "./abstractions";
import { map } from "./map";

export function sampledBy<A>(prop: Property<A>, sampler: EventStream<any>): EventStream<A> {
    return map(sampler, prop)
}