import * as L from "../src/index"
import { expectType } from "tsd"

expectType<L.EventStream<number>>(
  L.merge(L.later(0, 1, L.globalScope), L.later(0, 2, L.globalScope))
)
expectType<L.EventStreamSeed<number>>(L.merge(L.later(0, 1), L.later(0, 2)))
expectType<L.EventStreamSeed<number | string>>(
  L.merge(L.later(0, "1"), L.later(0, 2))
)
