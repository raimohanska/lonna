import { later } from "./later"
import { map } from "./map"
import { constant, toProperty } from "./property"

describe("PropertySeed",() => {
    it("Can be used only once", () => {
        const seed = toProperty(later(1, 1), 0)
        map(seed, () => {})
        expect(() => map(seed, () => {})).toThrow("already consumed")
    })
})
describe("EventStreamSeed",() => {
    it("Can be used only once", () => {
        const seed = later(1, 1)
        map(seed, () => {})
        expect(() => map(seed, () => {})).toThrow("already consumed")
    })
})