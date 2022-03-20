import * as L from "../src/index"
import { expectType } from "tsd"

expectType<L.Property<number>>(
  L.later(0, 1).pipe(L.scan(0, (x, y) => x + y, L.globalScope))
)
expectType<L.PropertySeed<number>>(
  L.later(0, 1).pipe(L.scan(0, (x, y) => x + y))
)
