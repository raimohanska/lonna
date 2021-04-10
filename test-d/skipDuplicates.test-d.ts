import * as L from "../src/index"
import { expectType } from "tsd"

expectType<L.Property<number>>(L.constant(1).pipe(L.skipDuplicates((a, b) => a == b, L.globalScope)))
expectType<L.PropertySeed<number>>(L.constant(1).pipe(L.skipDuplicates((a, b) => a == b)))