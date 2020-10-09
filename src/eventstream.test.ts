import * as B from "."

describe("EventStream", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(B.never() instanceof B.Property).toEqual(false)
            expect(B.never() instanceof B.EventStream).toEqual(true)
            expect(B.never() instanceof B.Observable).toEqual(true)
        })
    })

    it("map", () => {
        const b = B.bus<number>()
        const b2 = B.map(b, x => x * 2)
        const values: number[] = []
        b2.forEach(v => values.push(v))
        b.push(1)
        expect(values).toEqual([2])
    })
})
