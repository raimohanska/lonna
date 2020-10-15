import { wait } from "./test-utils"
import { merge } from "./merge"
import * as B from "."

describe("merge", () => {
    it("two streams", async () => {
        const merged = merge(B.later(1, "a", B.globalScope), B.later(1, "b", B.globalScope))
        const values: string[] = []
        merged.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual(["a", "b"])
    })

    it("two streams as array", async () => {
        const left = B.later(1, "a")
        const right = B.later(1, "b")
        const merged = merge<string>([left, right])
        const values: string[] = []
        merged.forEach(value => values.push(value))
        await wait(2)
        expect(values).toEqual(["a", "b"])
    })
})