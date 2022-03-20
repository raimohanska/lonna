import * as L from "../src/index"
import { expectType } from "tsd"

const seed = L.constant(0).pipe(
  L.filter((x) => true),
  L.changes
)
expectType<L.EventStreamSeed<number>>(seed)

const prop = L.constant(0).pipe(L.changes)
expectType<L.EventStream<number>>(prop)
