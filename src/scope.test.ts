import * as B from ".";
import { bus } from "./bus";
import { changes } from "./changes";
import { autoScope } from "./index";
import { scan } from "./scan";
import { createScope } from "./scope";

describe("Scope", () => {
    const scope = createScope()
    const b = bus<string>()
    const p = b.pipe(scan("", (st: string, next: string) => next, scope))
    describe("Before scope", () => {
        it("get() throws", () => {
            expect(() => p.get()).toThrow("bus.scan(fn) not in scope yet")
        })
    })
    describe("In scope", () => {
        beforeAll(() => scope.start())
        it("get() works", () => {
            expect(p.get()).toEqual("")            
        })
        it("forEach works", () => {
            const values: string[] = []
            p.forEach(v => values.push(v))
            b.push("first")
            expect(values).toEqual(["", "first"])
        })
        it("changes works", () => {
            const values: string[] = []
            p.pipe(changes).forEach(v => values.push(v))
            b.push("second")
            expect(values).toEqual(["second"])
        })

    })
    describe("After scope", () => {
        beforeAll(() => scope.end())
        it("get() throws", () => {
            expect(() => p.get()).toThrow("bus.scan(fn) not in scope any more")
        })
    })
})

describe("autoScope", () => {
    it("works in example scenario", () => {
        //bus.toProperty().map(fn).filter(fn)
        const bus = B.bus<number>()
        const scoped = bus.pipe(
            B.toProperty(1), 
            B.map((x: number) => x), 
            B.filter<number>(x => x >= 0),
            B.applyScope(autoScope)
        )        
        const values = [0]
        scoped.forEach(v => values.push(v))
        expect(values).toEqual([0, 1])
    })
})