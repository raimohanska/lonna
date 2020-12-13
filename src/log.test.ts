import { bus } from "./bus";
import { log } from "./index";
import { nop } from "./util";

describe("Property.log", () => {
  it("Calls given function for values", () => {
    const logs: any[] = []
    const origLog = console.log
    try {
      console.log = (...args: any) => logs.push(args)
      const b = bus<number>()
      const logged = b.pipe(log("msg"))
      logged.forEach(nop)

      b.push(1)
      b.push(2)
      expect(logs).toEqual([["msg", 1], ["msg", 2]])  
    } finally {
      console.log(origLog)
    }
  })
});