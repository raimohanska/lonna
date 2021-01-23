import { Atom, Function1, isScope, Scope } from "./abstractions";
import { IdentityTransformer, transform, UnaryTransformOp, UnaryTransformOpScoped } from "./transform";

export function cached<A,B>(f: Function1<A, B>): Function1<A, B>
export function cached<A>(): UnaryTransformOp<A>
export function cached<A>(scope: Scope): UnaryTransformOpScoped<A>

export function cached(f?: Function | Scope): any {
    if (!f || isScope(f)) {
        // cache for observables
        return transform(["cached", []], IdentityTransformer, f as Scope)
    } else {
        // cache function
        let previous: [any[], any] | null = null
        return function(...args: any[]) {
            if (previous !== null && equals(previous[0], args)) {
                return previous[1]
            }
            const result = f(...args)
            previous = [args, result]
            return result
        }
    }
}

function equals(xs: any[], ys: any[]) {
    if (xs.length !== ys.length) throw Error("Argument count mismatch")
    for (let i = 0; i < xs.length; i++) {
        if (xs[i] !== ys[i]) return false
    }
    return true
}