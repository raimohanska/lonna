import { atom } from "./atom";
import { filter } from "./filter";
import { never } from "./never";
import { toProperty } from "./property";
import { globalScope } from "./scope";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";
import * as B from "./index"
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
        const p = a.pipe(filter(lessThan(2), globalScope));
        a.set(2)
        expect(p.get()).toEqual(1)
    });
});

describe("Atom.filter", () => {
    describe("Root atom", () => {
        it("Freezes on unwanted values", () => {
            const a = B.filter(a => a !== null, B.globalScope)(B.atom<string | null>("hello"))
            
            a.set("world")
            expect(a.get()).toEqual("world")
            a.set(null)
            expect(a.get()).toEqual("world")
        })
    
        it("Freezes on unwanted values (when not getting in between sets)", () => {
            const atom = B.filter(a => a !== null, B.globalScope)(B.atom<string | null>("hello"))
            
            atom.set("world")        
            atom.set(null)
            expect(atom.get()).toEqual("world") 
        })        
    })
    

    describe("Dependent atom", () => {
        it("Freezes on unwanted values", () => {
            var b = B.bus()
            var prop = B.toProperty("1", B.globalScope)(b)
            const root = B.atom(prop, newValue => b.push(newValue))
            var atom = B.filter(a => a !== null, B.globalScope)(root)

            atom.set("world")
            expect(atom.get()).toEqual("world")
            atom.set(null)
            expect(atom.get()).toEqual("world")
        })

        it("Freezes on unwanted values (subscriber case)", () => {
            var b = B.bus()
            var prop = B.toProperty("1", B.globalScope)(b)
            const root = B.atom(prop, newValue => b.push(newValue))
            var atom = B.filter(a => a !== null, B.globalScope)(root)

            atom.set("world")        
            atom.set(null)
            expect(atom.get()).toEqual("world")        
        })     
    })
})
