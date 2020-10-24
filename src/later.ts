import { applyScopeMaybe } from "./applyscope"
import { EventStream, EventStreamSeed } from "."
import { Scope } from "./scope"
import GlobalScheduler from "./scheduler"
import { endEvent, valueEvent } from "./abstractions"
import { toString } from "./util"

export function later<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function later<V>(delay: number, value: V): EventStreamSeed<V>
export function later<V>(delay: number, value: V, scope?: Scope): any {
    return applyScopeMaybe(new EventStreamSeed(`later(${delay},${toString(value)})`, (observer) => {
        const timeout = GlobalScheduler.scheduler.setTimeout(() => { 
            observer(valueEvent(value))
            observer(endEvent)
        }, delay)
        return () => GlobalScheduler.scheduler.clearTimeout(timeout)
    }), scope)
}