import { expectPropertyEvents, series, testScope } from "./test-utils"
import * as L from "./index"
import { globalScope } from "./scope"
import { isProperty, isPropertySeed } from "./abstractions"
import { applyScope } from "./applyscope"

describe("cached", () => {
  describe("wraps a property", () => {
    expectPropertyEvents(() => {
      const o = series(1, [1, 2]).pipe(L.toProperty(0), L.cached())
      expect(isPropertySeed(o)).toEqual(true)
      return o
    }, [0, 1, 2])
    expectPropertyEvents(() => {
      const o = series(1, [1, 2]).pipe(L.toProperty(0), L.cached(testScope()))
      expect(isProperty(o)).toEqual(true)
      return o
    }, [0, 1, 2])
  })
  describe("caches value", () => {
    const a = L.atom(1)
    let counter = 0
    const mapper = (x: number) => {
      counter++
      return x
    }
    const p = a.pipe(L.map(mapper), L.cached(), L.applyScope(globalScope))
    p.get()
    expect(p.get()).toEqual(1)
    expect(counter).toEqual(1)
    a.set(2)
    p.get()
    expect(p.get()).toEqual(2)
    expect(counter).toEqual(2)
  })
  it("tostring", () => {
    const p = L.constant(1).pipe(L.cached())
    expect(p.toString()).toEqual("PropertySeed constant(1).cached()")
  })
})
