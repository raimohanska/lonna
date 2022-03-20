import * as L from "../src/index"
import { expectType } from "tsd"

const stopperStream = L.later(0, 1, L.globalScope)
expectType<L.PropertySeed<number>>(
  L.constant(1).pipe(L.takeUntil(stopperStream))
)
expectType<L.Property<number>>(
  L.constant(1).pipe(L.takeUntil(stopperStream, L.globalScope))
)
