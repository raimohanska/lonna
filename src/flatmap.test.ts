import { wait } from "./test-utils"
import * as B from "."

describe("flatmap", () => {
    it("streams", async () => {
        const root = B.later(1, 100, B.globalScope)
        const spawn = (value: number) => B.later(1, value * 2)
        const result = B.flatMap(root, spawn)
        const values: number[] = []
        result.forEach(value => values.push(value))
        await wait(3)
        expect(values).toEqual([200])
    })
})