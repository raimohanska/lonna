import { Scope } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { transform, Transformer, UnaryTransformOp, UnaryTransformOpScoped } from "./transform";

export type TypeGuard<A, B extends A> = (value: A) => value is B
export type Predicate<A> = (value: A) => boolean

export function filter<A, B extends A>(fn: TypeGuard<A, B>): UnaryTransformOp<A, B>
export function filter<A>(fn: Predicate<A>): UnaryTransformOp<A>
export function filter<A, B extends A>(fn: TypeGuard<A, B>, scope: Scope): UnaryTransformOpScoped<A, B>
export function filter<A>(fn: Predicate<A>, scope: Scope): UnaryTransformOpScoped<A>
export function filter<A>(fn: Predicate<A>, scope?: Scope): any {
    return (s: any) => applyScopeMaybe(transform(() => s + `.filter(fn)`, filterT(fn))(s), scope)
}

function filterT<A>(fn: Predicate<A>): Transformer<A, A> {
    return {
        changes: (subscribe) => (onValue, onEnd) => subscribe(value => {
                if (fn(value)) {
                    onValue(value)
                }
            }, onEnd),
        init: (value: A) => {
            if (!fn(value)) {
                throw Error(`Initial value not matching filter`)
            }
            return value
        }
    }
}
