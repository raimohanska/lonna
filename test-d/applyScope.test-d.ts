import * as L from "../src/index"
import { expectType } from "tsd"

const seed = L.constant(1).pipe(L.filter<number>(n => n == 0))
const property: L.Property<number> = L.constant(1)

expectType<L.Property<number>>(seed
    .pipe(L.applyScope(L.globalScope))
)
expectType<L.Property<number>>(property
    .pipe(L.applyScope(L.globalScope))
)

// FAILS
expectType<L.Property<number>>(L.constant(1).pipe(L.filter(n => n == 0), L.applyScope(L.globalScope)))

// FAILS
expectType<L.EventStream<number>>(L.later(0, 1).pipe(L.globalScope))
