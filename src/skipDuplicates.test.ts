import { atom } from "./atom";
import { never } from "./never";
import { toProperty } from "./property";
import { globalScope } from "./scope";
import { skipDuplicates } from "./skipDuplicates";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";
import * as B from "./index"

const increasing = (a: number, b: number) => a <= b

describe("EventStream.skipDuplicates", function () {
    describe("should skip duplicate values based on predicate", () =>
        expectStreamEvents(
            () => {
                const e = series(1, [1, 2, 1, 2, 3]).pipe(skipDuplicates(increasing));
                return e
            },
            [1, 2, 2, 3])
    );
    it("toString", () => expect(skipDuplicates(() => false)(never()).toString()).toEqual("never.skipDuplicates(fn)"));
});

describe("Property.skipDuplicates", function () {
    describe("should skip duplicate values based on predicate", () =>
        expectPropertyEvents(
            () => {
                const prop = series(1, [1, 0, 2]).pipe(toProperty(0), skipDuplicates(increasing))
                return prop
            },
            [0, 1, 2])
    );

    it("preserves old current value if the updated value is non-matching", function () {
        const a = atom(1)
        const p = a.pipe(B.map((x: number) => x))
        const sp = p.pipe(skipDuplicates(increasing, globalScope));
        a.set(0)
        expect(sp.get()).toEqual(1)
    });
});

describe("Atom.skipDuplicates", () => {
    describe("Root atom", () => {
        it("Freezes on unwanted values", () => {
            const root = B.atom(0)
            const a = root.pipe(skipDuplicates(increasing, globalScope))

            a.set(1)
            expect(a.get()).toEqual(1)
            a.set(0)
            expect(a.get()).toEqual(1)
            expect(root.get()).toEqual(0) // pass all values in set
            a.set(2)
            expect(a.get()).toEqual(2)
            expect(root.get()).toEqual(2)
        })

        it("Freezes on unwanted values (when not getting in between sets)", () => {
            const atom = skipDuplicates(increasing, B.globalScope)(B.atom(0))

            atom.set(1)
            atom.set(0)
            expect(atom.get()).toEqual(1)
        })
    })


    describe("Dependent atom", () => {
        it("Freezes on unwanted values", () => {
            const b = B.bus<number>()
            const prop = B.toProperty(0, B.globalScope)(b)
            const root = B.atom(prop, newValue => b.push(newValue))
            const atom = B.skipDuplicates(increasing, B.globalScope)(root)

            atom.set(1)
            expect(atom.get()).toEqual(1)
            atom.set(0)
            expect(atom.get()).toEqual(1)
        })

        it("Freezes on unwanted values (when not getting in between sets)", () => {
            const b = B.bus<number>()
            const prop = B.toProperty(0, B.globalScope)(b)
            const root = B.atom(prop, newValue => b.push(newValue))
            const atom = B.skipDuplicates(increasing, B.globalScope)(root)

            atom.set(1)
            atom.set(0)
            expect(atom.get()).toEqual(1)
        })
    })
})
