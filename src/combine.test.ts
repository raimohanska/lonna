import { combine, combineAsArray } from "./combine"
import { constant, toProperty } from "./toproperty";
import { expectPropertyEvents, series } from "./test-utils"
import { throttle } from "./throttle"

describe("combine", () => {
    describe("Forms", () => {
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
    })

    describe("combines latest values of two properties, with given combinator function", () =>
        expectPropertyEvents(
        function() {
            const left = series(2, [1, 2, 3]).pipe(toProperty(0))
            const right = series(2, [4, 5, 6]).pipe(throttle(1), toProperty(0))
            return combine(left, right, (l, r) => l + r)
        },
        [0, 1, 5, 6, 7, 8, 9])
    );

    it("Minimizes calls to mapping function", () => {
        let count = 0
        const a = constant("a")
        const b = constant("b")
        const mapped = combine(a, b,
            ((left, right) => {
                count++
            })
        )
        mapped.forEach(value => {})
        expect(count).toEqual(1)
      })

    it("toString", () => expect(combine(constant(1), constant(2), () => {}).toString()).toEqual("combine(constant(1),constant(2),fn)"));
})

describe("combineAsArray", () => {
    describe("combines latest values of two properties into array", () =>
        expectPropertyEvents(
        function() {
            const left = series(2, [1]).pipe(toProperty(0))
            const right = series(2, [4]).pipe(throttle(1), toProperty(0))
            return combineAsArray([left, right])
        },
        [[0,0], [1, 0], [1, 4]])
    );

    it("toString", () => expect(combineAsArray([constant(1), constant(2)]).toString()).toEqual("combineAsArray([constant(1),constant(2)])"));
})