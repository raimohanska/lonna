import { EventStream, isEventStream } from "./abstractions"
import { constant } from "./constant"
import { applyScope, changes, toProperty } from "./index"
import { expectStreamEvents, series, testScope } from "./test-utils"

describe("Property.changes", () => {
  expectStreamEvents(() => {
    const c = series(1, [1, 2]).pipe(toProperty(0), changes)
    return c
  }, [1, 2])
  expectStreamEvents(() => {
    const c = series(1, [1, 2]).pipe(
      toProperty(0),
      changes,
      applyScope(testScope())
    )
    return c
  }, [1, 2])
  it("types", () => {
    const p = series(1, [1, 2]).pipe(toProperty(0, testScope()))
    const c: EventStream<number> = p.pipe(changes) // explicit type to ensure correct typing
    expect(isEventStream(c)).toEqual(true)
  })
  it("toString", () => {
    expect(constant(0).pipe(changes).toString()).toEqual(
      "EventStream constant(0).changes()"
    )
  })
})
