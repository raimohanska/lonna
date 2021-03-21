import { wait } from "./test-utils"
import { merge } from "./merge"
import * as L from "."

describe("merge", () => {
    it("two streams", async () => {
        const merged = merge(L.later(1, "a", L.globalScope), L.later(1, "b", L.globalScope))
        const values: string[] = []
        merged.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual(["a", "b"])
    })

    it("two streams as array", async () => {
        const left = L.later(1, "a")
        const right = L.later(1, "b")
        const merged = merge<string>([left, right])
        const values: string[] = []
        merged.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual(["a", "b"])
    })
})