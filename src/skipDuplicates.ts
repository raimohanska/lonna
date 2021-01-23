import { Event, isValue, Observer, Scope } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { transform, Transformer, UnaryTransformOp, UnaryTransformOpScoped } from "./transform";

export type Predicate2<A> = (prev: A, next: A) => boolean

export function skipDuplicates<A>(fn: Predicate2<A>): UnaryTransformOp<A>
export function skipDuplicates<A>(fn: Predicate2<A>, scope: Scope): UnaryTransformOpScoped<A>
export function skipDuplicates<A>(fn: Predicate2<A>, scope?: Scope): any {
    return transform("skipDuplicates(fn)", skipDuplicatesT(fn), scope as Scope)
}

function skipDuplicatesT<A>(fn: Predicate2<A>): Transformer<A, A> {
    let current: A | typeof uninitialized = uninitialized
    return {
        changes: subscribe => (onValue, onEnd) => subscribe(
            value => {
                if (current === uninitialized || !fn(current, value)) {
                    current = value
                    onValue(value)
                }
            },
            onEnd
        ),
        init: (value: A) => {
            current = value
            return value
        }
    }
}

const uninitialized: unique symbol = Symbol()
