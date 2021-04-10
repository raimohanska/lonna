import { isEventStream } from "./abstractions"
import { applyScope } from "./applyscope"
import { atom } from "./atom"
import { bus } from "./bus"
import { later } from "./later"
import { map } from "./map"
import { createScope, globalScope } from "./scope"

describe("applyScope", () => {
    it("EventStreamSeed", () => {
        const x = later(0, 1).pipe(applyScope(globalScope))
        expect(isEventStream(x)).toEqual(true)
    })
    
    it("Using method", () => {
        const x = later(0, 1).applyScope(globalScope)
        expect(isEventStream(x)).toEqual(true)
    })

    it("scopes an Existing EventStream", () => {
        const s = bus<string>()
        const scope = createScope()
        const scoped = s.applyScope(scope)
        const values: string[] = []
        scoped.subscribe(v => values.push(v))
        s.push("first")
        scope.start()
        s.push("second")
        scope.end()
        s.push("third")
        expect(values).toEqual(["second"])
    })

    it("scopes an Existing Atom", () => {
        const a = atom("init")
        const scope = createScope()
        const scoped = a.applyScope(scope)
        const values: string[] = []
        const changes: string[] = []
        scoped.onChange(v => changes.push(v))
        scoped.subscribe(v => values.push(v))
        a.set("first")
        scope.start()
        a.set("second")
        scope.end()
        a.set("third")
        expect(changes).toEqual(["second"])
        expect(values).toEqual(["first", "second"])
    })

    it("scopes an Existing Property", () => {
        const a = atom("init")
        const scope = createScope()
        const scoped = a.pipe(map((x: string) => x), applyScope(scope))
        const values: string[] = []
        const changes: string[] = []
        scoped.onChange(v => changes.push(v))
        scoped.subscribe(v => values.push(v))
        a.set("first")
        scope.start()
        a.set("second")
        scope.end()
        a.set("third")
        expect(changes).toEqual(["second"])
        expect(values).toEqual(["first", "second"])
    })
})