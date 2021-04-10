import { Function1 } from "./abstractions";

export function cachedFn<A,B>(f: Function1<A, B>): Function1<A, B>
export function cachedFn(f: Function): any {
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

function equals(xs: any[], ys: any[]) {
    if (xs.length !== ys.length) throw Error("Argument count mismatch")
    for (let i = 0; i < xs.length; i++) {
        if (xs[i] !== ys[i]) return false
    }
    return true
}