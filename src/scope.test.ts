import * as B from "."
import { atom } from "./atom"
import { bus } from "./bus"
import { changes } from "./changes"
import { identityLens } from "./lens"
import { map } from "./map"
import { scan } from "./scan"
import { createScope } from "./scope"
import { hasObservers } from "./test-utils"
import { nop } from "./util"
import { view } from "./view"

describe("Manual Scope", () => {
  describe("Stateful Property", () => {
    const scope = createScope()
    const b = bus<string>()
    const p = b.pipe(scan("", (st: string, next: string) => next, scope))
    const eventsBeforeScope: string[] = []

    describe("Before scope", () => {
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope yet")
      })
      it("forEach() does not throw", () => {
        p.forEach((v) => eventsBeforeScope.push(v))
      })
    })
    describe("In scope", () => {
      beforeAll(() => scope.start())
      it("Calls subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual([""])
      })
      it("get() works", () => {
        expect(p.get()).toEqual("")
      })
      it("forEach works", () => {
        const values: string[] = []
        p.forEach((v) => values.push(v))
        b.push("first")
        expect(values).toEqual(["", "first"])
      })
      it("changes works", () => {
        const values: string[] = []
        p.pipe(changes).forEach((v) => values.push(v))
        b.push("second")
        expect(values).toEqual(["second"])
      })
      it("Keeps updating subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual(["", "first", "second"])
      })
    })
    describe("After scope", () => {
      beforeAll(() => scope.end())
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope any more")
      })

      it("forEach() does not throw", () => {
        // Should it?
        p.forEach(nop)
      })
    })
  })

  describe("Stateless Property", () => {
    const scope = createScope()
    const b = bus<string>()
    const p = b.pipe(
      scan("", (st: string, next: string) => next, scope),
      map((x: string) => x)
    )
    const eventsBeforeScope: string[] = []

    describe("Before scope", () => {
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope yet")
      })
      it("forEach() does not throw", () => {
        p.forEach((v) => eventsBeforeScope.push(v))
      })
    })
    describe("In scope", () => {
      beforeAll(() => scope.start())
      it("Calls subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual([""])
      })
      it("get() works", () => {
        expect(p.get()).toEqual("")
      })
      it("forEach works", () => {
        const values: string[] = []
        p.forEach((v) => values.push(v))
        b.push("first")
        expect(values).toEqual(["", "first"])
      })
      it("changes works", () => {
        const values: string[] = []
        p.pipe(changes).forEach((v) => values.push(v))
        b.push("second")
        expect(values).toEqual(["second"])
      })
      it("Keeps updating subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual(["", "first", "second"])
      })
    })
    describe("After scope", () => {
      beforeAll(() => scope.end())
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope any more")
      })

      it("forEach() does not throw", () => {
        // Should it?
        p.forEach(nop)
      })
    })
  })

  describe("Dependent Atom", () => {
    const scope = createScope()
    const b = bus<string>()
    const p = atom(
      b.pipe(scan("", (st: string, next: string) => next, scope)),
      () => {}
    )
    const eventsBeforeScope: string[] = []

    describe("Before scope", () => {
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope yet")
      })
      it("forEach() does not throw", () => {
        p.forEach((v) => eventsBeforeScope.push(v))
      })
    })
    describe("In scope", () => {
      beforeAll(() => scope.start())
      it("Calls subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual([""])
      })
      it("get() works", () => {
        expect(p.get()).toEqual("")
      })
      it("forEach works", () => {
        const values: string[] = []
        p.forEach((v) => values.push(v))
        b.push("first")
        expect(values).toEqual(["", "first"])
      })
      it("changes works", () => {
        const values: string[] = []
        p.pipe(changes).forEach((v) => values.push(v))
        b.push("second")
        expect(values).toEqual(["second"])
      })
      it("Keeps updating subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual(["", "first", "second"])
      })
    })
    describe("After scope", () => {
      beforeAll(() => scope.end())
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope any more")
      })

      it("forEach() does not throw", () => {
        // Should it?
        p.forEach(nop)
      })
    })
  })

  describe("Lensed Atom", () => {
    const scope = createScope()
    const b = bus<string>()
    const p = view(
      atom(
        b.pipe(scan("", (st: string, next: string) => next, scope)),
        () => {}
      ),
      identityLens()
    )
    const eventsBeforeScope: string[] = []

    describe("Before scope", () => {
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope yet")
      })
      it("forEach() does not throw", () => {
        p.forEach((v) => eventsBeforeScope.push(v))
      })
    })
    describe("In scope", () => {
      beforeAll(() => scope.start())
      it("Calls subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual([""])
      })
      it("get() works", () => {
        expect(p.get()).toEqual("")
      })
      it("forEach works", () => {
        const values: string[] = []
        p.forEach((v) => values.push(v))
        b.push("first")
        expect(values).toEqual(["", "first"])
      })
      it("changes works", () => {
        const values: string[] = []
        p.pipe(changes).forEach((v) => values.push(v))
        b.push("second")
        expect(values).toEqual(["second"])
      })
      it("Keeps updating subscribers that were added before scope", () => {
        expect(eventsBeforeScope).toEqual(["", "first", "second"])
      })
    })
    describe("After scope", () => {
      beforeAll(() => scope.end())
      it("get() throws", () => {
        expect(() => p.get()).toThrow("bus.scan(fn) not in scope any more")
      })

      it("forEach() does not throw", () => {
        // Should it?
        p.forEach(nop)
      })
    })
  })
})
