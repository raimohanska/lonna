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
})