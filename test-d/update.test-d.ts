import * as L from "../src/index"
import { expectType } from "tsd"

const src = L.later(0, 1)
expectType<L.PropertySeed<number>>(L.update(0, [src, (acc, next) => next]))