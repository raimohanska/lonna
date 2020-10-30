import { debounce } from ".";
import { EventStream, isEventStream } from "./abstractions";
import { applyScope } from "./applyscope";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, expectStreamTimings, series, testScope } from "./test-utils";
import { throttle } from "./throttle";

describe("EventStream.debounce(delay)", function () {
    describe("throttles input by given delay", () =>
        expectStreamEvents(
            () => {
                const s = series(2, [1, 1, 1, 1, 2]).pipe(debounce(7))
                return s
            },
            [2])
    );
    describe("waits for a quiet period before outputing anything", () =>
        expectStreamTimings(
            () => series(2, [1, 2, 3, 4]).pipe(debounce(3)),
            [[11, 4]])
    );

    it ("Scoped debounce", () => {
        const s = series(2, [1, 1, 1, 1, 2]).pipe(debounce(7, testScope()))
        expect(isEventStream(s)).toEqual(true)
    })

    it("toString", () => expect(debounce(1)(never()).toString()).toEqual("never.debounce(1)"));
});

describe("Property.debounce", function () {
    describe("throttles changes, but not initial value", () =>
        expectPropertyEvents(
            () => {
                const p = series(1, [1, 2, 3]).pipe(debounce(4), toProperty(0), applyScope(testScope()))
                return p
            },
            [0, 3])
    );
    it("toString", () => expect(debounce(1)(constant(0)).toString()).toEqual("constant(0).debounce(1)"));
});
