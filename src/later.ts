import { applyScope, applyScopeMaybe } from "./applyscope"
import { EventStream, EventStreamSeed } from "."
import { Scope } from "./scope"

export function later<V>(delay: number, value: V, scope: Scope): EventStream<V>
export function later<V>(delay: number, value: V): EventStreamSeed<V>
export function later<V>(delay: number, value: V, scope?: Scope): any {
    return applyScopeMaybe(new EventStreamSeed(`interval(${delay}, ${value})`, (observer) => {
        const timeout = setTimeout(() => observer(value), delay)
        return () => clearTimeout(timeout)
    }), scope)
}