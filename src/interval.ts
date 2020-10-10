import { EventStream, EventStreamSeed } from "."
import { valueEvent } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import GlobalScheduler from "./scheduler"
import { Scope } from "./scope"

export function interval<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function interval<V>(delay: number, value: V): EventStreamSeed<V>
export function interval<V>(delay: number, value: V, scope?: Scope): any {
  return applyScopeMaybe(new EventStreamSeed(`interval(${delay}, ${value})`, (observer) => {
        const interval = GlobalScheduler.scheduler.setInterval(() => observer(valueEvent(value)), delay)
        return () => clearInterval(interval)
  }), scope)
}