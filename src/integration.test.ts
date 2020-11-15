import { atom, filter, later, map, toProperty } from ".";

describe("PropertySeed",() => {
    it("Can be used only once", () => {
        const seed = toProperty(0)(later(1, 1))
        map(() => {})(seed)
        
        expect(() => map(() => {})(seed)).toThrow("already consumed")
    })
})
describe("EventStreamSeed",() => {
    it("Can be used only once", () => {
        const seed = later(1, 1)
        map(() => {})(seed)
        expect(() => map(() => {})(seed)).toThrow("already consumed")
    })
})
describe("AtomSeed",() => {
    it("Can be used only once", () => {
        const seed = filter(() => true)(atom(0))
        map(() => {})(seed)        
        expect(() => map(() => {})(seed)).toThrow("already consumed")
    })
})