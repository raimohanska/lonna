import * as B from "."
import { wait } from "./test-utils"

describe("map", () => {
    it("constant property", () => {
        const b = B.constant(1)
        const b2 = B.map(b, x => x * 2)
        expect(b2.get()).toEqual(2)
    })

    it("stream into property value", async () => {
        const prop = B.constant(1)
        const stream = B.later(1, "a", B.globalScope)
        const sampled = B.map(stream, prop)
        const values: number[] = []
        sampled.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual([1])
    })
})
