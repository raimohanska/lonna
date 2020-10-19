import { fromPromise, PromiseMapper } from "./frompromise";
import { expectPropertyEvents } from "./test-utils";

describe("fromPromise", function() {
  describe("Default", function() {
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

  describe("Custom mapper", function() {
    const mapper = [
      () => "init",
      value => value,
      error => error.toString()
    ] as PromiseMapper<string, string>

    describe("on success", () =>
      expectPropertyEvents(
        () => {
          const p = fromPromise(new Promise(function(res, rej) { res("ok"); }) as any, ...mapper)
          return p
        },
        ["ok"])
    );
    describe("on error", () =>
      expectPropertyEvents(
          () => fromPromise(new Promise(function(res, rej) { rej("fail"); }) as any, ...mapper),
          ["fail"])
      );
  });
});
