import { map, MapOp } from "./map";

export function tap<A>(fn: (value: A) => any): MapOp<A, A> {
    return map((x: A) => {
        fn(x)
        return x
    })
}