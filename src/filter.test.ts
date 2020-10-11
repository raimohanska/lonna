import { atom } from "./atom";
import { filter } from "./filter";
import { never } from "./never";
import { toProperty } from "./property";
import { globalScope } from "./scope";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";

const lessThan = (n: number) => (x: number) => x < n

describe("EventStream.filter", function () {
    describe("should filter values", () =>
        expectStreamEvents(
            () => filter(series(1, [1, 2, 3]), lessThan(3)),
            [1, 2])
    );
    it("toString", () => expect(filter(never(), () => false).toString()).toEqual("never.filter(fn)"));
});

describe("Property.filter", function () {
    describe("should filter values", () =>
        expectPropertyEvents(
            () => filter(toProperty(series(1, [1, 2, 3]), 0), lessThan(3)),
            [0, 1, 2])
    );
    it("preserves old current value if the updated value is non-matching", function () {
        const a = atom(1)
        const p = filter(a, lessThan(2), globalScope);
        a.set(2)
        expect(p.get()).toEqual(1)
    });
});
