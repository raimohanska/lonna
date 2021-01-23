import { atom, globalScope, never, skipDuplicates, toProperty } from "./index";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";

const sameSign = (a: number, b: number) => Math.sign(a) === Math.sign(b)

describe("EventStream.skipDuplicates", function () {
    describe("should skip duplicate values based on predicate", () =>
        expectStreamEvents(
            () => {
                const e = series(1, [1, 2, -1, 2, 3]).pipe(skipDuplicates(sameSign));
                return e
            },
            [1, -1, 2])
    );
    it("toString", () => expect(skipDuplicates(() => false)(never()).toString()).toEqual("EventStreamSeed never.skipDuplicates(fn)"));
});

describe("Property.skipDuplicates", function () {
    describe("should skip duplicate values based on predicate", () =>
        expectPropertyEvents(
            () => {
                const prop = series(1, [1, 2, -2]).pipe(toProperty(0), skipDuplicates(sameSign))
                return prop
            },
            [0, 1, -2])
    );
});

describe("Atom.skipDuplicates", () => {
    it("Skips duplicates", () => {
        const root = atom(0)
        const a = root.pipe(skipDuplicates(sameSign, globalScope))

        a.set(1)
        expect(a.get()).toEqual(1)
        a.set(2)
        expect(a.get()).toEqual(1)
        expect(root.get()).toEqual(2) // pass all values in set
        a.set(-1)
        expect(a.get()).toEqual(-1)
        expect(root.get()).toEqual(-1)
    })
})
