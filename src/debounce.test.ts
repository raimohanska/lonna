import { debounce } from ".";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, expectStreamTimings, series } from "./test-utils";
import { throttle } from "./throttle";

describe("EventStream.debounce(delay)", function () {
    describe("throttles input by given delay", () =>
        expectStreamEvents(
            () => debounce(series(2, [1, 1, 1, 1, 2]), 7),
            [2])
    );
    describe("waits for a quiet period before outputing anything", () =>
        expectStreamTimings(
            () => debounce(series(2, [1, 2, 3, 4]), 3),
            [[11, 4]])
    );

    it("toString", () => expect(debounce(never(), 1).toString()).toEqual("never.debounce(1)"));
});

describe("Property.debounce", function () {
    describe("throttles changes, but not initial value", () =>
        expectPropertyEvents(
            () => debounce(toProperty(series(1, [1, 2, 3]), 0), 4),
            [0, 3])
    );
    it("toString", () => expect(debounce(constant(0), 1).toString()).toEqual("constant(0).debounce(1)"));
});
