import { EventStream, Property } from "./abstractions"
import { map } from "./map"

export function sampledBy<A>(
  sampler: EventStream<any>
): (prop: Property<A>) => EventStream<A> {
  // TODO: rename result, test
  return (prop: Property<A>) => map(prop)(sampler)
}
