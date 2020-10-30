import { Event, isValue, Observer, Scope } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { transform, Transformer, UnaryTransformOp, UnaryTransformOpScoped } from "./transform";

export type Predicate<A> = (value: A) => boolean

export function filter<A>(fn: Predicate<A>): UnaryTransformOp<A>
export function filter<A>(fn: Predicate<A>, scope: Scope): UnaryTransformOpScoped<A>
export function filter<A>(fn: Predicate<A>, scope?: Scope): any {
    return (s: any) => applyScopeMaybe(transform(s + `.filter(fn)`, filterT(fn))(s), scope)
}

function filterT<A>(fn: Predicate<A>): Transformer<A, A> {
    return {
        changes: (event: Event<A>, observer: Observer<Event<A>>) => {
            if (isValue(event)) {
                if (fn(event.value)) {
                    observer(event)
                }
            } else {
                observer(event)
            }
        },
        init: (value: A) => {
            if (!fn(value)) {
                throw Error(`Initial value not matching filter`)
            }
            return value
        }
    }
}