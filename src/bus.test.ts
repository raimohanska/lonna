import * as B from "."

describe("Bus", () => {
    it("works", () => {
        const b = B.bus<number>()        
        const values: number[] = []
        b.forEach(v => values.push(v))
        b.push(1)
        expect(values).toEqual([1])
    })
})
