import { EventStream } from "./abstractions"
import { applyScope, applyScopeMaybe } from "./applyscope"
import { later } from "./later"
import { pipe } from "./pipe"
import { globalScope } from "./scope"

describe("applyScope", () => {
    it("EventStreamSeed", () => {
        const x = later(0, 1).pipe(applyScope(globalScope))
        expect(x instanceof EventStream).toEqual(true)
    })
})