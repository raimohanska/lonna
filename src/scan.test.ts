import * as B from "."
import { valueEvent, Event } from "./abstractions"

describe("Property", () => {
    it("scan", () => {
        const b = B.bus<number>()
        const op = B.scan(0, (a: number, b: number) => a + b, B.globalScope)
        const prop = b.pipe(op)
        const values: number[] = []
        const valuesChange: Event<number>[] = []
        prop.forEach(v => values.push(v))
        prop.onChange(v => valuesChange.push(v))
        expect(values).toEqual([0])
        expect(valuesChange).toEqual([])
        b.push(1)
        expect(values).toEqual([0, 1])
        expect(valuesChange).toEqual([valueEvent(1)])
        b.push(1)
        expect(values).toEqual([0, 1, 2])
        expect(valuesChange).toEqual([valueEvent(1), valueEvent(2)])
    })
})
