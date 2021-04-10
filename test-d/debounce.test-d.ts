import * as L from "../src/index"
import { expectType } from "tsd"

const seed = L.constant(0).pipe(L.debounce(0))
expectType<L.PropertySeed<number>>(seed)
const prop = L.constant(0).pipe(L.debounce(0, L.globalScope), L.map(x => x))
expectType<L.Property<number>>(prop)