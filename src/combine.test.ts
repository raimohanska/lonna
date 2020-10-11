import { combine, combineAsArray } from "./combine"
import { constant } from "./property"

describe("Combine", () => {
    it("Function last", () => {
        expect(combine (() => 0).get()).toEqual(0)
        expect(combine(constant(1), x => x * 2).get()).toEqual(2)
        expect(combine(constant(1), constant(2), (x, y) => x * y).get()).toEqual(2)
        expect(combine(constant(1), constant(2), constant(3), (x, y, z) => x * y * z).get()).toEqual(6)
    })
    it("Function first", () => {
        expect(combine (() => 0).get()).toEqual(0)
        expect(combine(x => x * 2, constant(1)).get()).toEqual(2)
        expect(combine((x, y) => x * y, constant(1), constant(2)).get()).toEqual(2)        
    })
    it("Properties in array", () => {
        expect(combine (() => 0, []).get()).toEqual(0)
        expect(combine((x: number) => x * 2, [constant(1)]).get()).toEqual(2)        
        expect(combine([constant(1)], (x: number) => x * 2).get()).toEqual(2)        
    })

    it("CombineAsArray", () => {
        expect(combineAsArray([]).get()).toEqual([])
        expect(combineAsArray([constant(1)]).get()).toEqual([1])        
    })

})