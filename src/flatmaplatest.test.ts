import { Property } from "./abstractions";
import { flatMapLatest } from "./flatmaplatest";
import { never } from "./never";
import { constant, toProperty } from "./property";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";
import { nop } from "./util"


describe("EventStream.flatMapLatest", () => {
  describe("spawns new streams but collects values from the latest spawned stream only", () =>
    expectStreamEvents(
      () => flatMapLatest(series(3, [1, 2]), value => series(2, [value, value])) ,
      [1, 2, 2])
  );
  it("toString", () => expect(flatMapLatest(never(), nop as any).toString()).toEqual("never.flatMapLatest(fn)"));
});

describe("Property.flatMapLatest", function() {
  describe("switches to new source property", () =>
    expectPropertyEvents(
      () => {
          const property = toProperty(series(3, [1, 2]), 0)
          const spawner = (value: number) => toProperty(series(2, [value + "." + 1, value + "." + 2]), value + "." + 0)
          return flatMapLatest(property, spawner)
      }, 
      ["0.0", "0.1", "1.1", "2.1", "2.2"])
  );
  it("toString", () => expect(flatMapLatest(constant(1), nop as any).toString()).toEqual("constant(1).flatMapLatest(fn)"));
})