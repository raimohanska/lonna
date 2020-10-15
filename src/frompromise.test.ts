import { fromPromise } from "./frompromise";
import { expectPropertyEvents } from "./test-utils";

describe("fromPromise", function() {
  describe("With native Promise", function() {
    describe("on success", () =>
      expectPropertyEvents(
        () => fromPromise(new Promise(function(res, rej) { res("ok"); }) as any),
        [{ state: "resolved", value: "ok"}])
    );
    describe("on error", () =>
    expectPropertyEvents(
        () => fromPromise(new Promise(function(res, rej) { rej("fail"); }) as any),
        [{ state: "rejected", error: "fail"}])
    );
  });
});
