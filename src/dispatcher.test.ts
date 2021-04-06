import * as B from "."

describe("Dispatcher", () => {
    it("Defers items pushed during dispatch", () => {
        const results: number[] = []
        const b = B.bus<number>()
        b.forEach(n => {
            if (n == 0) b.push(1)
        })
        b.forEach(n => results.push(n))
        b.forEach(n => results.push(n))
        b.push(0)
        expect(results).toEqual([0, 0, 1, 1])
    })

    it("Removes listeners also during dispatch", () => {
        const results: string[] = []
        const b = B.bus<number>()
        
        const unsub1 = b.forEach(n => {
            results.push(n + "-1")
            unsub2()
        })
        const unsub2 = b.forEach(n => results.push(n + "-2"))
        const unsub3 = b.forEach(n => results.push(n + "-3"))
        b.push(0)
        expect(results).toEqual(["0-1", "0-3"])
    })

    it("Doesn't dispatch to listeners added during current dispatch", () => {
        const results: string[] = []
        const b = B.bus<number>()
        
        const unsub1 = b.forEach(n => {
            results.push(n + "-1")
            if (n === 0) {                
                const unsub3 = b.forEach(n => results.push(n + "-3"))
            }
        })
        const unsub2 = b.forEach(n => results.push(n + "-2"))
        
        b.push(0)
        b.push(1)
        expect(results).toEqual(["0-1", "0-2", "1-1", "1-2", "1-3"])
    })
})
