import { debounce } from ".";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, expectStreamTimings, series } from "./test-utils";
import { throttle } from "./throttle";

describe("EventStream.debounce(delay)", function () {
    describe("throttles input by given delay", () =>
        expectStreamEvents(
            () => debounce(7)(series(2, [1, 1, 1, 1, 2])),
            [2])
    );
    describe("waits for a quiet period before outputing anything", () =>
        expectStreamTimings(
            () => debounce(3)(series(2, [1, 2, 3, 4])),
            [[11, 4]])
    );

    it("toString", () => expect(debounce(1)(never()).toString()).toEqual("never.debounce(1)"));
});

describe("Property.debounce", function () {
    describe("throttles changes, but not initial value", () =>
        expectPropertyEvents(
            () => debounce(4)(toProperty(0)(series(1, [1, 2, 3]))),
            [0, 3])
    );
    it("toString", () => expect(debounce(1)(constant(0)).toString()).toEqual("constant(0).debounce(1)"));
});
