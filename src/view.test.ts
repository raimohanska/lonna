import * as B from "."

describe("view", () => {
    describe("Array index lenses", () => {
        it("Views into existing and non-existing indices", () => {
            const a = B.atom([1,2,3])
            expect(B.view(a, 1).get()).toEqual(2)
    
            expect(B.view(a, 3).get()).toEqual(undefined)    
        })
        it("Supports removal by setting to undefined", () => {
            const a = B.atom([1,2,3])
            const view = B.view(a, 1)
    
            view.set(undefined)
            expect(a.get()).toEqual([1, 3])            
        })    
    })
    describe("Object key lenses", () => {
        it("Manipulates object properties", () => {
            const a = B.atom({foo: "bar"})
            const view = B.view(a, "foo")
            expect(view.get()).toEqual("bar")
        })    
    })
})