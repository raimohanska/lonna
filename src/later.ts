import { applyScopeMaybe } from "./applyscope"
import { EventStream, EventStreamSeed, Scope } from "./abstractions"
import GlobalScheduler from "./scheduler"
import { endEvent, valueEvent } from "./abstractions"
import { toString } from "./util"
import { EventStreamSeedImpl } from "./implementations"

export function later<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function later<V>(delay: number, value: V): EventStreamSeed<V>
export function later<V>(delay: number, value: V, scope?: Scope): any {
    return applyScopeMaybe(new EventStreamSeedImpl(`later(${delay},${toString(value)})`, (observer) => {
        const timeout = GlobalScheduler.scheduler.setTimeout(() => { 
            observer(valueEvent(value))
            observer(endEvent)
        }, delay)
        return () => GlobalScheduler.scheduler.clearTimeout(timeout)
    }), scope)
}