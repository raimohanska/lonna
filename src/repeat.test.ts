import * as Bacon from "..";
import { later } from "./later";
import { toProperty } from "./property";
import { repeat } from "./repeat";

import { expectStreamEvents } from "./test-utils";

describe("repeat", function() {
  describe("Polls new streams from generator function until empty result", () =>
    expectStreamEvents(
      function() {
        let count = 0;
        const s = repeat(function(iteration) {
          count++;
          if (count <= 3) {
            return later(1, count * iteration);
          }
        });
        return s
      },
      [0,2,6])
  );

  describe("Supports Properties", () =>
    expectStreamEvents(
      function() {
        let count = 0;
        return repeat(function(iteration) {
          count++;
          if (count <= 3) {
            return toProperty(-1)(later(1, count * iteration));
          }
        });
      },
      [0, -1, 2, -1, 6]) // Note: the initial value -1 is missed because it occurs synchrnously before we subscribe
  );
});
