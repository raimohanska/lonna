import * as B from "."
import { map } from "./map";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, series, wait } from "./test-utils"

const times2 = (x: number) => x * 2;
const toString = (x: number) => "" + x;

describe("Property.map", () => {
  describe("maps property values", () => {
    expectPropertyEvents(
      () => {
        const x = series(1, [2]).pipe(toProperty(1), map(toString))
        return x
      },
      ["1", "2"])
  })
});

describe("EventStream.map", () => {
  describe("should map with given function", () =>
    expectStreamEvents(
      () => map(times2)(series(1, [1, 2, 3])),
      [2, 4, 6])
  );
  
  describe("can map to a Property value", () => {
    expectStreamEvents(
      () => map(constant(2))(series(1, [1,2,3])),
      [2,2,2])
  });  
  it("toString", () => {
      expect(map(() => true)(never()).toString()).toEqual("never.map(fn)")
  });
});
