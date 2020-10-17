import { expectStreamEvents } from "./test-utils";
import { EventEmitter } from "events";
import { fromEvent } from "./fromevent";
import { take } from "./take";

// TODO: test that toString for DOM Elements are sensible (no deep json structures)
// Wrap EventEmitter as EventTarget
const toEventTarget = (emitter: any) =>
  ({
    addEventListener(event: any, handler: any) {
      emitter.addListener(event, handler);
    },
    removeEventListener(event: any, handler: any) { 
        emitter.removeListener(event, handler); 
    }
  })
;

describe("Bacon.fromEvent", function() {
  const soon = (f: any) => setTimeout(f, 0);

  const onOffSource = function() { return {
    cleaned: false,
    on(type: any, callback: any) { callback(type); },
    off(callback: any) { this.cleaned = true; }
  }; };

  const bindUnbindSource = function() { return {
    cleaned: false,
    bind(type: any, callback: any) { callback(type); },
    unbind(callback: any) { this.cleaned = true; },
    on() { throw "bait method"; },
    addEventListener() { throw "bait method"; },
    addListener() { throw "bait method"; }
  }; };

  describe("eventSource is a string (the name of the event type to bind)", function() {
    describe("should create EventStream from DOM object", () =>
      expectStreamEvents(
        () => {
          const emitter = new EventEmitter();
          emitter.on("newListener", () => soon(() => emitter.emit("click", "x")));
          const element = toEventTarget(emitter);
          const src = fromEvent(element, "click")
          return take(1, src);
        },
        ["x"]
      )
    );

    describe("should create EventStream from EventEmitter", () =>
      expectStreamEvents(
        function() {
          const emitter = new EventEmitter();
          emitter.on("newListener", () => soon(() => emitter.emit("data", "x")));
          return take(1, fromEvent(emitter, "data"));
        },
        ["x"]
      )
    );

    it("should clean up event listeners from EventEmitter", function() {
      const emitter = new EventEmitter();
      const stream = take(1, fromEvent(emitter, "data"))
      stream.forEach(function() {})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      emitter.emit("data", "x");
      expect(emitter.listeners("data").length).toEqual(0);
    });

    it("should clean up event listeners from DOM object", function() {
      const emitter = new EventEmitter();
      const element = toEventTarget(emitter);
      const dispose = fromEvent(element, "click").forEach(function() {});
      dispose();
      expect(emitter.listeners("click").length).toEqual(0);
    });

    it("should create EventStream from on/off event", function() {
      const values: string[] = [];
      const src = onOffSource();
      take(1, fromEvent<string>(src, "test")).forEach(value => {values.push(value)})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      expect(values).toEqual(["test"]);
      expect(src.cleaned).toEqual(true);
    });

    it("should create EventStream even if removeListener method missing", function() {
      const values: string[] = [];
      const src = {
        addListener(type: any, callback: any) { return callback(type); }
      };
      take(1, fromEvent<string>(src, "test")).forEach(value => {values.push(value)});
      expect(values).toEqual(["test"])
  });

    it("should create EventStream from bind/unbind event", function() {
      const values: string[] = [];
      const src = bindUnbindSource();
      take(1, fromEvent<string>(src, "test")).forEach(value => {values.push(value)})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      expect(values).toEqual(["test"]);
      expect(src.cleaned).toEqual(true);

    });

    it("toString", () => expect(fromEvent(onOffSource(), "click").toString()).toEqual("fromEvent({cleaned:false,on:fn,off:fn},click)"));
  });

  describe("eventSource is a function (a custom bind/unbind handler)", function() {
    describe("should create EventStream from DOM object", () =>
      expectStreamEvents(
        function() {
          const emitter = new EventEmitter();
          emitter.on("newListener", () => soon(() => emitter.emit("click", "x")));
          const element = toEventTarget(emitter);
          return take(1, fromEvent(element, (binder, listener) => binder("click", listener)));
        },
        ["x"]
      )
    );

    describe("should create EventStream from EventEmitter", () =>
      expectStreamEvents(
        function() {
          const emitter = new EventEmitter();
          emitter.on("newListener", () => soon(() => emitter.emit("data", "x")));
          return take(1, fromEvent(emitter, (binder, listener) => binder("data", listener)));
        },
        ["x"]
      )
    );

    it("should clean up event listeners from EventEmitter", function() {
      const emitter = new EventEmitter();
      take(1, fromEvent(emitter, (binder, listener) => binder("data", listener))).forEach(function() {})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      emitter.emit("data", "x");
      expect(emitter.listeners("data").length).toEqual(0);
    });

    it("should clean up event listeners from DOM object", function() {
      const emitter = new EventEmitter();
      const element = toEventTarget(emitter);
      const dispose = fromEvent(element, (binder, listener) => binder("click", listener)).forEach(function() {});
      dispose();
      expect(emitter.listeners("click").length).toEqual(0);
    });

    it("should create EventStream from on/off event", function() {
      const values: string[] = [];
      const src = onOffSource();
      take(1, fromEvent<string>(src, (binder, listener) => binder("test", listener))).forEach(value => {values.push(value)})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      expect(values).toEqual(["test"]);
        expect(src.cleaned).toEqual(true);
    });

    it("should create EventStream even if removeListener method missing", function() {
      const values: string[] = [];
      const src = {
        addListener(type: any, callback: any) { return callback(type); }
      };
      take(1, fromEvent<string>(src, (binder, listener) => binder("test", listener))).forEach(value => {values.push(value)});
      expect(values).toEqual(["test"])
  });

    it("should create EventStream from bind/unbind event", function() {
      const values: string[] = [];
      const src = bindUnbindSource();
      take(1, fromEvent<string>(src, (binder, listener) => binder("test", listener))).forEach(value => {values.push(value)})(); // TODO: currently Lonna streams don't auto-unsub on end. Should they?
      expect(values).toEqual(["test"]);
      expect(src.cleaned).toEqual(true);
    });

    it("toString", () =>
      expect(fromEvent(onOffSource(), (binder, listener) => binder("click", listener)).toString())
        .toEqual("fromEvent({cleaned:false,on:fn,off:fn},fn)")
    );
  });
});
