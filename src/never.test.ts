import { never } from "./never"

describe("never", () => {
  it("toString", () => {
    expect(never().toString()).toEqual("EventStream never")
  })
})
