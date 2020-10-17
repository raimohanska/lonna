import * as B from "."
import { map } from "./map";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, series, wait } from "./test-utils"

const times2 = (x: number) => x * 2;

describe("Property.map", () => {
  describe("maps property values", () => {
    expectPropertyEvents(
      () => map(toProperty(series(1, [2]), 1), times2),
      [2, 4, ])
  })
});

describe("EventStream.map", () => {
  describe("should map with given function", () =>
    expectStreamEvents(
      () => map(series(1, [1, 2, 3]), times2),
      [2, 4, 6])
  );
  
  describe("can map to a Property value", () => {
    expectStreamEvents(
      () => map(series(1, [1,2,3]), constant(2)),
      [2,2,2])
  });  
  it("toString", () => {
      expect(map(never(), () => true).toString()).toEqual("never.map(fn)")
  });
});

describe("map", () => {
    it("constant property", () => {
        const b = B.constant(1)
        const b2 = B.map(b, x => x * 2)
        expect(b2.get()).toEqual(2)
    })

    it("stream into property value", async () => {
        const prop = B.constant(1)
        const stream = B.later(1, "a", B.globalScope)
        const sampled = B.map(stream, prop)
        const values: number[] = []
        sampled.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual([1])
    })
})
