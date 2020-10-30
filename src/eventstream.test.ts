import * as B from "."
import { isEventStream, isEventStreamSeed, isProperty } from "./abstractions"

describe("EventStream", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            expect(isProperty(B.never())).toEqual(false)
            expect(isEventStream(B.never())).toEqual(true)
            expect(isEventStreamSeed(B.never())).toEqual(true)
        })
    })
})
