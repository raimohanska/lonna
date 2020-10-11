import * as B from "."
import { toProperty } from "./property"
import { autoScope } from "./scope"

describe("autoScope", () => {
    it("works in example scenario", () => {
        //bus.toProperty().map(fn).filter(fn)
        const bus = B.bus<number>()
        const prop = B.filter(B.map(B.toProperty(bus, 1), x => x), x => x >= 0)
        const scoped = B.applyScope(autoScope, prop)
        const values = [0]
        scoped.forEach(v => values.push(v))
        expect(values).toEqual([0, 1])
    })
})