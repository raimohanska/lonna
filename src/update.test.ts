import { later } from ".";
import { constant, never, update } from "./index";
import { expectPropertyEvents, testScope } from "./test-utils";

describe("update", function() {
  describe("Updates value based on stream events", () =>
    expectPropertyEvents(
      function() {
        const a = later(1, "x");
        const b = later(2, "y");

        return update(0,
          [a, (acc, x) => acc + x],
          [b, (acc, x) => acc + x]
        );
      },
      [0, "0x", "0xy"])
  );

  describe("Support property value capture", () =>
    expectPropertyEvents(
      function() {
        const a = later(1, "x");
        const b = later(2, "y");
        const p = constant("C")

        return update(0,
          [a, (acc, x) => acc + x],
          [b, p, (acc, x, c) => acc + x + c]
        );
      },
      [0, "0x", "0xyC"])
  );

describe("Supports constant result value", () =>
  expectPropertyEvents(
    function() {
      const a = later(1, "x");
      const b = later(2, "y");

      return update(0,
        [a, (acc, x) => acc + x],
        [b, 666]
      );
    },
    [0, "0x", 666])
);

describe("Scoped version", () =>
  expectPropertyEvents(
    function() {
      const a = later(1, "x");
      const b = later(2, "y");

      return update(testScope(), 0,
        [a, (acc, x) => acc + x],
        [b, 666]
      );
    },
    [0, "0x", 666])
);

it("toString", () => {
  expect(
      update(0, [never(), (state, v) => state]
    ).toString()).toEqual("PropertySeed update(0,[[never,fn]])")
  });
});
