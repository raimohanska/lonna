import {
  Desc,
  Event,
  EventStream,
  EventStreamSeed,
  EventStreamSource,
  isProperty,
  Observer,
  Property,
  PropertySeed,
} from "./abstractions"
import { StatelessEventStream } from "./eventstream"
import { EventStreamSeedImpl } from "./eventstream"

export function changes<O extends PropertySeed<any> | Property<any>>(
  property: O
): O extends Property<infer A>
  ? EventStream<A>
  : O extends PropertySeed<infer A>
  ? EventStreamSeed<A>
  : never

export function changes<T>(
  property: Property<T> | PropertySeed<T>
): EventStream<T> | EventStreamSeed<T> {
  const desc = [property, "changes", []] as Desc
  const source = property.consume()
  const sub = (onValue: Observer<T>, onEnd?: Observer<void>) => {
    return source.onChange(onValue, onEnd)
  }
  if (isProperty<T>(source)) {
    return new StatelessEventStream(desc, sub, source.getScope())
  } else {
    return new EventStreamSeedImpl(desc, sub)
  }
}
