import * as O from "optics-ts"
import * as L from "./index"
describe("optics-ts", () => {
    it("basic optics can be used with Lonna atoms", () => {
        type Data = {
            foo: { bar: number }
            other: string
        }
        const foo = O.optic<Data>().prop('foo')// as L.Lens<Data, { bar: number }>
        
        const a = L.atom<Data>({ foo: { bar: 1 }, other: "hello" })
        const viewed = L.view(a, foo)

        expect(viewed.get()).toEqual({ bar: 1 })
        viewed.set({ bar: 2 })
        expect(a.get()).toEqual({ foo: { bar: 2 }, other: "hello" })
    })
})