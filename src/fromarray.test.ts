import * as B from "."
import { debounce } from "./debounce";
import { delay } from "./delay";
import { fromArray } from "./fromarray";
import { expectStreamEvents } from "./test-utils"

describe("fromArray", () => {
    describe("Produces given events", () =>
        expectStreamEvents(
            () => fromArray([1, 2, 3]).pipe(delay(0)),
            [1, 2, 3])
    );
})
