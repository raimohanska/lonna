import * as L from "../src/index"
import { expectType, expectError } from "tsd"

expectType<L.EventStreamSeed<number>>(
  L.later(0, 1).pipe(L.flatMap((v) => L.later(0, v)))
)
expectType<L.EventStream<number>>(
  L.later(0, 1).pipe(L.flatMap((v) => L.later(0, v), L.globalScope))
)
