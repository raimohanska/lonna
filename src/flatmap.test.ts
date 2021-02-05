import { constant, flatMap, never } from ".";
import { fromArray } from "./fromarray";
import { expectStreamEvents, series } from "./test-utils";
import { nop } from "./util";

describe("EventStream.flatMap", function() {
  describe("should spawn new stream for each value and collect results into a single stream", () =>
    expectStreamEvents(
      () => {
        const op = flatMap((value: number) => series(2, [value, value]))
        const s = series(1, [1, 2]).pipe(op)
        return s
      },
      [1, 2, 1, 2])
  );
  describe("works in combination with fromArray", () =>
    expectStreamEvents(
      () => {
        const op = flatMap((value: number) => fromArray([value, value]))
        const s = series(1, [1, 2]).pipe(op)
        return s
      },
      [1, 1, 2, 2])
  );  
  describe("Works also when f returns a Property instead of an EventStream", () =>
    expectStreamEvents(
      () => flatMap(constant)(series(1, [1,2])),
      [1,2])
  );
  it("toString", () => expect(flatMap(nop as any)(never()).toString()).toEqual("EventStreamSeed never.flatMap(fn)"));
});