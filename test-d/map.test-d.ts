import * as L from "../src/index"
import { expectType } from "tsd"

const prop = L.constant(0).pipe(L.map((x) => x))
expectType<L.Property<number>>(prop)
