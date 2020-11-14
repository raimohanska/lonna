import { atom } from "./atom";
import { never } from "./never";
import { constant, toProperty } from "./toproperty";
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
});

describe("Atom.skipDuplicates", () => {
    it("Skips duplicates", () => {
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
})
