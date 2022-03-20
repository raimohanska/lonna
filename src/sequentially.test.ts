import * as B from "."
import { expectStreamEvents, series } from "./test-utils"

describe("sequentially", () => {
  describe("Produces given events", () =>
    expectStreamEvents(() => series(1, [1, 2, 3]), [1, 2, 3]))
})
