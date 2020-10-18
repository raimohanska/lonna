import * as B from "."
import { pipe } from "./pipe"
import { toProperty } from "./property"
import { autoScope } from "./scope"

describe("autoScope", () => {
    it("works in example scenario", () => {
        //bus.toProperty().map(fn).filter(fn)
        const bus = B.bus<number>()
        const prop = B.filter<number>(x => x >= 0)(B.map((x: number) => x)(B.toProperty(1)(bus)))
        const scoped = B.applyScope(autoScope)(prop)
        const values = [0]
        scoped.forEach(v => values.push(v))
        expect(values).toEqual([0, 1])
    })
})