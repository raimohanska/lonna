import { flatMap } from "./flatmap";
import { never } from "./never";
import { constant } from "./property";
import { expectStreamEvents, series } from "./test-utils";
import { nop } from "./util";

describe("EventStream.flatMap", function() {
  describe("should spawn new stream for each value and collect results into a single stream", () =>
    expectStreamEvents(
      () => flatMap(value => series(2, [value, value]))(series(1, [1, 2])) ,
      [1, 2, 1, 2])
  );
  describe("Works also when f returns a Property instead of an EventStream", () =>
    expectStreamEvents(
      () => flatMap(constant)(series(1, [1,2])),
      [1,2])
  );
  it("toString", () => expect(flatMap(nop as any)(never()).toString()).toEqual("never.flatMap(fn)"));
});