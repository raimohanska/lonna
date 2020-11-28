import * as O from "optics-ts"
import * as L from "./index"
describe("optics-ts", () => {
    describe("basic optics can be used with Lonna atoms", () => {
        type Data = {
            foo: { bar: number }
            other: string
        }
        const original = { foo: { bar: 1 }, other: "hello" }
        it("Lens", () => {
            const foo = O.optic<Data>().prop('foo')// as L.Lens<Data, { bar: number }>
            
            const a = L.atom<Data>(original)
            const viewed = L.view(a, foo)
    
            expect(viewed.get()).toEqual({ bar: 1 })
            viewed.set({ bar: 2 })
            expect(a.get()).toEqual({ foo: { bar: 2 }, other: "hello" })
        })
        it("Equivalence", () => {
            const eq = O.optic<Data>()
            
            const a = L.atom<Data>(original)
            const viewed = L.view(a, eq)
    
            expect(viewed.get()).toEqual(original)
            const modified = { foo: { bar: 2 }, other: "hello" }
            viewed.set(modified)
            expect(a.get()).toEqual(modified)
        })
        it("Isomorpohism", () => {
            const eq = O.optic<Data>().iso(x => x, x => x)
            
            const a = L.atom<Data>(original)
            const viewed = L.view(a, eq)
    
            expect(viewed.get()).toEqual(original)
            const modified = { foo: { bar: 2 }, other: "hello" }
            viewed.set(modified)
            expect(a.get()).toEqual(modified)
        })
    })
    
})