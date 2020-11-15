import { EventStream, EventStreamSeed } from "."
import { valueEvent, Scope } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { EventStreamSeedImpl } from "./eventstream"
import GlobalScheduler from "./scheduler"

export function interval<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function interval<V>(delay: number, value: V): EventStreamSeed<V>
export function interval<V>(delay: number, value: V, scope?: Scope): any {
  return applyScopeMaybe(new EventStreamSeedImpl(`interval(${delay}, ${value})`, (observer) => {
        const interval = GlobalScheduler.scheduler.setInterval(() => observer(valueEvent(value)), delay)
        return () => GlobalScheduler.scheduler.clearInterval(interval)
  }), scope)
}