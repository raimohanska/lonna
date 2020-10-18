import * as B from "."
import { globalScope } from "./scope"

describe("Property", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(B.constant(1) instanceof B.Property).toEqual(true)
            expect(B.constant(1) instanceof B.Observable).toEqual(true)
        })

        it ("Has synchronous current value", () => {
            const prop = B.toProperty("hello", globalScope)(B.never<number>())
            expect(prop.get()).toEqual("hello")
        })
    })
})
