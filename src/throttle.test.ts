import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamTimings, series } from "./test-utils";
import { throttle } from "./throttle";

describe("EventStream.throttle(delay)", function() {
  describe("outputs at steady intervals, without waiting for quiet period", () =>
    expectStreamTimings(
      () => throttle(series(2, [1, 2, 3]), 3),
      [[5, 2], [8, 3]])
  );
  it("toString", () => expect(throttle(never(), 1).toString()).toEqual("never.throttle(1)"));
});

describe("Property.throttle", function() {
  describe("throttles changes, but not initial value", () =>
    expectPropertyEvents(
      () => throttle(toProperty(series(1, [1,2,3]), 0), 4),
      [0,3])
  );
  it("toString", () => expect(throttle(constant(0), 1).toString()).toEqual("constant(0).throttle(1)"));
});
