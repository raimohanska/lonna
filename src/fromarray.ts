import { EventStream, EventStreamSeed, Scope } from "./abstractions"
import { fromSubscribe } from "./fromsubscribe"
import { nop, rename } from "./util"

/**
 */
export function fromArray<V>(events: V[], scope: Scope): EventStream<V>
export function fromArray<V>(events: V[]): EventStreamSeed<V>

export function fromArray<V>(events: V[], scope?: Scope): any {
  // TODO: rename to use Description as well
  return rename(
    `fromArray(${events},fn)`,
    fromSubscribe((onValue, onEnd = nop) => {
      events.forEach(onValue)
      onEnd && onEnd()
      return nop
    }, scope as any)
  )
}
