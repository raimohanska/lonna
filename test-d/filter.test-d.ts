import * as L from "../src/index"
import { expectType } from "tsd"

expectType<L.PropertySeed<number>>(L.constant(1).pipe(L.filter((n) => n == 0)))

expectType<L.Property<number>>(
  L.constant(1).pipe(L.filter((n) => n == 0, L.globalScope))
)

const seed = L.constant(1).pipe(L.filter((n) => n == 0))
expectType<L.PropertySeed<number>>(seed)

expectType<L.PropertySeed<number>>(
  L.constant(1 as number | null).pipe(L.filter(nonNull))
)

function nonNull<A>(x: A | null): x is A {
  return x !== null
}
