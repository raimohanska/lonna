import * as B from "."
import * as L from "."
import { later } from "./later"
import {
  expectPropertyEvents,
  expectStreamEvents,
  series,
  testScope,
} from "./test-utils"
import { constant } from "./index"
import { toProperty } from "./toproperty"

describe("Atom.view", () => {
  describe("Array index lenses", () => {
    it("Views into existing and non-existing indices", () => {
      const a = B.atom([1, 2, 3])
      expect(B.view(a, 1).get()).toEqual(2)

      expect(B.view(a, 3).get()).toEqual(undefined)
    })
    it("Supports removal by setting to undefined", () => {
      const a = B.atom([1, 2, 3])
      const view = B.view(a, 1)
      view.set(undefined)
      expect(a.get()).toEqual([1, 3])
    })
  })
  describe("Object key lenses", () => {
    it("Manipulates object properties", () => {
      const a = B.atom({ foo: "bar" })
      const view = B.view(a, "foo")
      expect(view.get()).toEqual("bar")
    })
  })

  it("maps property values by unary function", () => {
    const a = B.atom([1, 2, 3])
    expect(B.view(a, (xs) => xs[0]).get()).toEqual(1)
  })
})

const fooBar = { foo: "bar" }

describe("Property.view", () => {
  describe("maps property values by string key", () => {
    expectPropertyEvents(() => B.view(constant(fooBar), "foo"), ["bar"])
  })

  describe.only("maps property values by unary function", () => {
    expectPropertyEvents(
      () => B.view(constant(fooBar), (v) => v.foo + " lol"),
      ["bar lol"]
    )
    it("toString", () => {
      expect(
        B.view(constant(fooBar), (v) => v.foo + " lol").toString()
      ).toEqual("Property constant({foo:bar}).view(fn)")
    })
  })

  it("maps property values by unary function chain, skipping duplicates on every step", () => {
    let calls = 0
    let values: boolean[] = []
    const a = B.atom(0)
    const result = B.view(
      a,
      (x) => x > 0,
      (b) => {
        calls++
        return b
      }
    )
    result.forEach((b) => values.push(b))
    a.set(1)
    a.set(2)
    a.set(3)
    expect(values).toEqual([false, true])
    expect(calls).toEqual(2)
  })

  describe("combines multiple property values by n-ary function", () => {
    expectPropertyEvents(
      () =>
        B.view(
          constant(fooBar),
          constant("hello"),
          (v, h) => h + " " + v.foo + " lol"
        ),
      ["hello bar lol"]
    )
  })

  describe("No glitches in diamond-shaped setup", () => {
    expectPropertyEvents(() => {
      const root = series(1, [{ a: "a1", b: "b1" }]).pipe(
        toProperty({ a: "a0", b: "b0" }, testScope())
      )
      const combined = L.view(
        L.view(root, "a"),
        L.view(root, "b"),
        (a, b) => a + b
      )
      return combined
    }, ["a0b0", "a1b1"])
  })

  it("toString", () => {
    expect(B.view(constant(fooBar), "foo").toString()).toEqual(
      "Property constant({foo:bar}).view(foo)"
    )
  })
})

describe("EventStream.view", () => {
  describe("maps property values by string key", () => {
    expectStreamEvents(() => B.view(later(1, fooBar), "foo"), ["bar"])
  })

  describe("maps property values by unary function", () => {
    expectStreamEvents(
      () => B.view(later(1, fooBar), (v) => v.foo + " lol"),
      ["bar lol"]
    )
  })

  it("toString", () => {
    expect(B.view(later(1, fooBar), "foo").toString()).toEqual(
      "EventStreamSeed later(1,{foo:bar}).view(foo)"
    )
  })
})
