import { EventStream } from "./abstractions"
import { applyScope } from "./applyscope"
import { later } from "./later"
import { globalScope } from "./scope"

describe("applyScope", () => {
    it("EventStreamSeed", () => {
        const x = later(0, 1).pipe(applyScope(globalScope))
        expect(x instanceof EventStream).toEqual(true)
    })
})