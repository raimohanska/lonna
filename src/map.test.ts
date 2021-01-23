import * as B from ".";
import { constant, map, never, toProperty } from "./index";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";

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

  it("Minimizes calls to mapping function", () => {
    let count = 0
    const property = B.constant("foo")
    const mapped = property.pipe(
        B.map((value: string) => {
            count++
        })
    )
    mapped.forEach(value => {})
    expect(count).toEqual(1)
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
      expect(map(() => true)(never()).toString()).toEqual("EventStream never.map(fn)")
  });
});
