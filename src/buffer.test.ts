import * as Bacon from ".";

import { expectStreamEvents, expectStreamTimings, series, atGivenTimes, sc } from "./test-utils";
import { bufferWithCount, bufferWithTime } from "./buffer"
import { never } from "./never";

describe("EventStream.bufferWithTime", function() {
  describe("returns events in bursts, passing through errors", () =>
    expectStreamEvents(
      () => {
        const s = series(2, [1, 2, 3, 4, 5, 6, 7]).pipe(bufferWithTime(7))
        return s
      },
      [[1, 2, 3, 4], [5, 6, 7]])
  );
  describe("keeps constant output rate even when input is sporadical", () =>
    expectStreamTimings(
      () => bufferWithTime(2)(atGivenTimes([[0, "a"], [3, "b"], [5, "c"]])),
      [[2, ["a"]], [4, ["b"]], [6, ["c"]]]
    )
  );
  describe("works with empty stream", () =>
    expectStreamEvents(
      () => bufferWithTime(1)(never()),
      [])
  );
  describe("allows custom defer-function", function() {
    const fast = (f: Function) => sc.setTimeout(f, 0);
    return expectStreamTimings(
      () => bufferWithTime(fast)(atGivenTimes([[0, "a"], [2, "b"]])),
      [[0, ["a"]], [2, ["b"]]]);
  });
  describe("works with synchronous defer-function", function() {
    const sync = (f: Function) => f();
    return expectStreamTimings(
      () => bufferWithTime(sync)(atGivenTimes([[0, "a"], [2, "b"]])),
      [[0, ["a"]], [2, ["b"]]]);
  });
  it("toString", () => expect(never().pipe(bufferWithTime(1)).toString()).toEqual("EventStreamSeed never.bufferWithTime(1)"));
});

describe("EventStream.bufferWithCount", function() {
  describe("returns events in chunks of fixed size, passing through errors", () =>
    expectStreamEvents(
      () => bufferWithCount(2)(series(1, [1, 2, 3, 4, 5])),
      [[1, 2], [3, 4], [5]])
  );
  it("toString", () => expect(bufferWithCount(1)(never()).toString()).toEqual("EventStreamSeed never.bufferWithCount(1)"));
});