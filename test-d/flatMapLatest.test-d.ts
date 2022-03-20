import * as L from "../src/index"
import { expectType } from "tsd"

expectType<L.PropertySeed<number>>(
  L.constant(1).pipe(L.flatMapLatest((v) => L.constant(v)))
)
expectType<L.Property<number>>(
  L.constant(1).pipe(L.flatMapLatest((v) => L.constant(v), L.globalScope))
)

expectType<L.EventStreamSeed<number>>(
  L.later(0, 1).pipe(L.flatMapLatest((v) => L.constant(v)))
)
expectType<L.EventStream<number>>(
  L.later(0, 1).pipe(L.flatMapLatest((v) => L.constant(v), L.globalScope))
)
