import * as B from "."

describe("Atom", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(B.atom(1) instanceof B.Atom).toEqual(true)
            expect(B.atom(1) instanceof B.Property).toEqual(true)
            expect(B.atom(1) instanceof B.Observable).toEqual(true)
        })

        it ("Dispatches values", () => {
            const a = B.atom(1)
            let value: any = null
            a.forEach(v => value = v)
            expect(value).toEqual(1)
            a.set(2)
            expect(value).toEqual(2)
        })
    })
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

    describe("Freezing", () => {
        it("Can be frozen on unwanted values", () => {
            const a = B.filter(B.atom<string | null>("hello"), a => a !== null, B.globalScope)
            
            a.set("world")
            expect(a.get()).toEqual("world")
            a.set(null)
            expect(a.get()).toEqual("world")
        })
    
        it("Can be frozen on unwanted values (when not getting in between sets)", () => {
            const atom = B.filter(B.atom<string | null>("hello"), a => a !== null, B.globalScope)    
            
            atom.set("world")        
            atom.set(null)
            expect(atom.get()).toEqual("world") 
        })    
    })

})

describe("Dependent Atom", () => {
    it("Works", () => {
        var b = B.bus()
        var prop = B.toProperty(b, "1", B.globalScope)
        var atom = B.atom(prop, newValue => b.push(newValue))        
        expect(atom.get()).toEqual("1")
        atom.set("2")
        expect(atom.get()).toEqual("2")
    })

    describe("Freezing", () => {
        it("Can be frozen on unwanted values", () => {
            var b = B.bus()
            var prop = B.toProperty(b, "1", B.globalScope)
            const root = B.atom(prop, newValue => b.push(newValue))
            var atom = B.filter(root, a => a !== null, B.globalScope)
    
            atom.set("world")
            expect(atom.get()).toEqual("world")
            atom.set(null)
            expect(atom.get()).toEqual("world")
        })
    
        it("Can be frozen on unwanted values (subscriber case)", () => {
            var b = B.bus()
            var prop = B.toProperty(b, "1", B.globalScope)
            const root = B.atom(prop, newValue => b.push(newValue))
            var atom = B.filter(root, a => a !== null, B.globalScope)
    
            atom.set("world")        
            atom.set(null)
            expect(atom.get()).toEqual("world")        
        })     
    })
})