import * as B from "."

describe("Property", () => {
    it("map", () => {
        const b = B.constant(1)
        const b2 = B.map(b, x => x * 2)
        expect(b2.get()).toEqual(2)
    })
})
