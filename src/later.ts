import { applyScopeMaybe } from "./applyscope"
import { EventStream, EventStreamSeed, Scope } from "./abstractions"
import GlobalScheduler from "./scheduler"
import { nop, toString } from "./util"
import { EventStreamSeedImpl } from "./eventstream"

export function later<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function later<V>(delay: number, value: V): EventStreamSeed<V>
export function later<V>(delay: number, value: V, scope?: Scope): any {
    return applyScopeMaybe(new EventStreamSeedImpl(() => `later(${delay},${toString(value)})`, (onValue, onEnd = nop) => {
        const timeout = GlobalScheduler.scheduler.setTimeout(() => { 
            onValue(value)
            onEnd()
        }, delay)
        return () => GlobalScheduler.scheduler.clearTimeout(timeout)
    }), scope)
}