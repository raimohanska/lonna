import { valueEvent } from "./abstractions";
import { fromPoll } from "./frompoll";
import { take } from "./take";
import { expectStreamEvents } from "./test-utils";

describe("Bacon.fromPoll", () => {
  describe("repeatedly polls given function for values", () =>
    expectStreamEvents(
      () => take(2)(fromPoll(1, (() => "lol"))),
      ["lol", "lol"])
  );
  /*
  describe("supports returning Event objects", () =>
    expectStreamEvents(
      () => take(2, fromPoll(1, (() => valueEvent(1)))),
      [1, 1])
  );
  describe("supports returning array of Event objects", () =>
    expectStreamEvents(
      () => take(2, fromPoll(1, (() => [valueEvent(1)]))),
      [1, 1])
  );
  */
  it("toString", () => expect(fromPoll(1, (() => {})).toString()).toEqual("fromPoll(1,fn)"));
});
