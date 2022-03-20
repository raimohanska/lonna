import { constant, never, throttle, toProperty } from "./index"
import { expectPropertyEvents, expectStreamTimings, series } from "./test-utils"

describe("EventStream.throttle(delay)", function () {
  describe("outputs at steady intervals, without waiting for quiet period", () =>
    expectStreamTimings(() => {
      const s = series(2, [1, 2, 3]).pipe(throttle(3))
      return s
    }, [
      [5, 2],
      [8, 3],
    ]))
  it("toString", () =>
    expect(never().pipe(throttle(1)).toString()).toEqual(
      "EventStreamSeed never.throttle(1)"
    ))
})

describe("Property.throttle", function () {
  describe("throttles changes, but not initial value", () =>
    expectPropertyEvents(
      () => series(1, [1, 2, 3]).pipe(toProperty(0), throttle(4)),
      [0, 3]
    ))
  it("toString", () =>
    expect(throttle(1)(constant(0)).toString()).toEqual(
      "PropertySeed constant(0).throttle(1)"
    ))
})
