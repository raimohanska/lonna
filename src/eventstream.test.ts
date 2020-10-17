import * as B from "."

describe("EventStream", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(B.never() instanceof B.Property).toEqual(false)
            expect(B.never() instanceof B.EventStream).toEqual(true)
            expect(B.never() instanceof B.Observable).toEqual(true)
        })
    })
})
