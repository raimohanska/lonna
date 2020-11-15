import { atom, bus, map, filter, globalScope, never, toProperty } from "./index";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";
const lessThan = (n: number) => (x: number) => x < n

describe("EventStream.filter", function () {
    describe("should filter values", () =>
        expectStreamEvents(
            () => {
                const e = series(1, [1, 2, 3]).pipe(filter(lessThan(3)));
                return e
            },
            [1, 2])
    );
    it("toString", () => expect(filter(() => false)(never()).toString()).toEqual("never.filter(fn)"));
});

describe("Property.filter", function () {
    describe("should filter values", () =>
        expectPropertyEvents(
            () => {
                const prop = series(1, [1, 2, 3]).pipe(toProperty(0), filter(lessThan(3)))
                return prop
            },
            [0, 1, 2])
    );
    it("preserves old current value if the updated value is non-matching", function () {
        const a = atom(1)
        const p = a.pipe(map((x: number) => x))
        const fp = p.pipe(filter(lessThan(2), globalScope));
        a.set(2)
        expect(fp.get()).toEqual(1)
    });
});

describe("Atom.filter", () => {
    describe("Root atom", () => {
        it("Freezes on unwanted values", () => {
            const root = atom<string | null>("hello")
            const a = root.pipe(filter(a => a !== null, globalScope))
            
            a.set("world")
            expect(a.get()).toEqual("world")
            a.set(null)
            expect(a.get()).toEqual("world")
            expect(root.get()).toEqual(null) // pass all values in set
            a.set("hello")
            expect(a.get()).toEqual("hello")
            expect(root.get()).toEqual("hello")
        })
    
        it("Freezes on unwanted values (when not getting in between sets)", () => {
            const a = filter(a => a !== null, globalScope)(atom<string | null>("hello"))
            
            a.set("world")        
            a.set(null)
            expect(a.get()).toEqual("world") 
        })   
    })
    

    describe("Dependent atom", () => {
        it("Freezes on unwanted values", () => {
            const b = bus<string | null>()
            const prop = toProperty("1", globalScope)(b)
            const root = atom(prop, newValue => b.push(newValue))
            const a = filter(a => a !== null, globalScope)(root)

            a.set("world")
            expect(a.get()).toEqual("world")
            a.set(null)
            expect(a.get()).toEqual("world")
        })

        it("Freezes on unwanted values (when not getting in between sets)", () => {
            const b = bus<string | null>()
            const prop = toProperty("1", globalScope)(b)
            const root = atom(prop, newValue => b.push(newValue))
            const a = filter(a => a !== null, globalScope)(root)

            a.set("world")        
            a.set(null)
            expect(a.get()).toEqual("world")        
        })     
    })
})
