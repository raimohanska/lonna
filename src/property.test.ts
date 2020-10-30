import * as B from "."
import { isEventStream, isProperty, isPropertySeed } from "./abstractions"
import { globalScope } from "./scope"

describe("Property", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(isProperty(B.constant(1))).toEqual(true)
            expect(isPropertySeed(B.constant(1))).toEqual(true)
            expect(isEventStream(B.constant(1))).toEqual(false)
        })

        it ("Has synchronous current value", () => {
            const prop = B.toProperty("hello", globalScope)(B.never<number>())
            expect(prop.get()).toEqual("hello")
        })
    })
})
