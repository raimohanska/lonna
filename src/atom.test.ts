import * as B from "."

describe("Atom", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(B.isAtom(B.atom(1))).toEqual(true)
            expect(B.isProperty(B.atom(1))).toEqual(true)
            expect(B.isAtomSeed(B.atom(1))).toEqual(true)
            expect(B.isPropertySeed(B.atom(1))).toEqual(true)
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
        var prop = B.toProperty("1", B.globalScope)(b)
        var atom = B.atom(prop, newValue => b.push(newValue))        
        expect(atom.get()).toEqual("1")
        atom.set("2")
        expect(atom.get()).toEqual("2")
    })
})