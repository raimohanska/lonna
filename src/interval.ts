import { applyScope } from "./applyscope"
import { EventStream, EventStreamSeed } from "."
import { Scope } from "./scope"
import { valueEvent } from "./abstractions"

export function interval<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function interval<V>(delay: number, value: V): EventStreamSeed<V>
export function interval<V>(delay: number, value: V, scope?: Scope): any {
    const seed = new EventStreamSeed(`interval(${delay}, ${value})`, (observer) => {
        const e = valueEvent(value)
        const interval = setInterval(() => observer(e), delay)
        return () => clearInterval(interval)
    })
    if (scope !== undefined) {
        return applyScope(scope, seed)
    }
    return seed
}