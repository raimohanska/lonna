import * as Bacon from ".";

import { expectStreamEvents, expectStreamTimings, series, atGivenTimes, sc } from "./test-utils";
import { bufferWithCount, bufferWithTime } from "./buffer"
import { never } from "./never";

describe("EventStream.bufferWithTime", function() {
  describe("returns events in bursts, passing through errors", () =>
    expectStreamEvents(
      () => bufferWithTime(series(2, [1, 2, 3, 4, 5, 6, 7]), 7),
      [[1, 2, 3, 4], [5, 6, 7]])
  );
  describe("keeps constant output rate even when input is sporadical", () =>
    expectStreamTimings(
      () => bufferWithTime(atGivenTimes([[0, "a"], [3, "b"], [5, "c"]]), 2),
      [[2, ["a"]], [4, ["b"]], [6, ["c"]]]
    )
  );
  describe("works with empty stream", () =>
    expectStreamEvents(
      () => bufferWithTime(never(), 1),
      [])
  );
  describe("allows custom defer-function", function() {
    const fast = (f: Function) => sc.setTimeout(f, 0);
    return expectStreamTimings(
      () => bufferWithTime(atGivenTimes([[0, "a"], [2, "b"]]), fast),
      [[0, ["a"]], [2, ["b"]]]);
  });
  describe("works with synchronous defer-function", function() {
    const sync = (f: Function) => f();
    return expectStreamTimings(
      () => bufferWithTime(atGivenTimes([[0, "a"], [2, "b"]]), sync),
      [[0, ["a"]], [2, ["b"]]]);
  });
  it("toString", () => expect(bufferWithTime(never(), 1).toString()).toEqual("never.bufferWithTime(1)"));
});

describe("EventStream.bufferWithCount", function() {
  describe("returns events in chunks of fixed size, passing through errors", () =>
    expectStreamEvents(
      () => bufferWithCount(series(1, [1, 2, 3, 4, 5]), 2),
      [[1, 2], [3, 4], [5]])
  );
  it("toString", () => expect(bufferWithCount(never(), 1).toString()).toEqual("never.bufferWithCount(1)"));
});