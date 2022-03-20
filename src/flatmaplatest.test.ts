import { constant, flatMapLatest, never, toProperty } from "."
import { applyScope } from "./applyscope"
import { atom } from "./atom"
import { globalScope } from "./scope"
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils"
import { nop } from "./util"

describe("EventStream.flatMapLatest", () => {
  describe("spawns new streams but collects values from the latest spawned stream only", () =>
    expectStreamEvents(() => {
      const s = flatMapLatest((value: number) => series(2, [value, value]))(
        series(3, [1, 2])
      )
      return s
    }, [1, 2, 2]))
  it("toString", () =>
    expect(flatMapLatest(nop as any)(never()).toString()).toEqual(
      "EventStreamSeed never.flatMapLatest(fn)"
    ))
})

describe("Property.flatMapLatest", function () {
  describe("switches to new source property", () =>
    expectPropertyEvents(() => {
      const spawner = (value: number) =>
        toProperty(value + "." + 0)(
          series(2, [value + "." + 1, value + "." + 2])
        )
      const property = series(3, [1, 2]).pipe(
        toProperty(0),
        flatMapLatest(spawner)
      )
      return property
    }, ["0.0", "0.1", "1.0", "1.1", "2.0", "2.1", "2.2"]))
  describe("with constants", () =>
    expectPropertyEvents(() => {
      const spawner = (value: number) => constant(value)
      const property = series(3, [1, 2]).pipe(
        toProperty(0),
        flatMapLatest(spawner)
      )
      return property
    }, [0, 1, 2]))
  it("With atoms and constants", () => {
    const root = atom("hello")
    const result = root.pipe(
      flatMapLatest((v: string) => {
        return constant(v)
      }),
      applyScope(globalScope)
    )
  })
  it("toString", () =>
    expect(flatMapLatest(nop as any)(constant(1)).toString()).toEqual(
      "PropertySeed constant(1).flatMapLatest(fn)"
    ))
})
