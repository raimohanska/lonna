import { never } from "./never";
import { constant, toProperty } from "./toproperty";
import { expectPropertyEvents, expectStreamTimings, series } from "./test-utils";
import { throttle } from "./throttle";

describe("EventStream.throttle(delay)", function() {
  describe("outputs at steady intervals, without waiting for quiet period", () =>
    expectStreamTimings(
      () => {
        const s = series(2, [1, 2, 3]).pipe(throttle(3))
        return s
      },
      [[5, 2], [8, 3]])
  );
  it("toString", () => expect(throttle(1)(never()).toString()).toEqual("never.throttle(1)"));
});

describe("Property.throttle", function() {
  describe("throttles changes, but not initial value", () =>
    expectPropertyEvents(
      () => series(1, [1,2,3]).pipe(toProperty(0), throttle(4)),
      [0,3])
  );
  it("toString", () => expect(throttle(1)(constant(0)).toString()).toEqual("constant(0).throttle(1)"));
});
