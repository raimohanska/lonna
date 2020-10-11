import { flatMap } from "./flatmap";
import { never } from "./never";
import { constant } from "./property";
import { expectStreamEvents, series } from "./test-utils";
import { nop } from "./util";

describe("EventStream.flatMap", function() {
  describe("should spawn new stream for each value and collect results into a single stream", () =>
    expectStreamEvents(
      () => flatMap(series(1, [1, 2]), value => series(2, [value, value])) ,
      [1, 2, 1, 2])
  );
  describe("Works also when f returns a Property instead of an EventStream", () =>
    expectStreamEvents(
      () => flatMap(series(1, [1,2]), constant),
      [1,2])
  );
  it("toString", () => expect(flatMap(never(), nop as any).toString()).toEqual("never.flatMap(fn)"));
});