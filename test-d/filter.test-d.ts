import * as L from "../src/index"
import { expectType } from "tsd"

// This ok
expectType<L.PropertySeed<number>>(L.constant(1).pipe(L.filter(n => n == 0)))
// This fails. The only difference is the introduction of the const
const seed = L.constant(1).pipe(L.filter(n => n == 0))
expectType<L.PropertySeed<number>>(seed)
// Restoring TypeGuards in filter.ts will cause more breakage
