import { filter, later, never, toProperty } from "./index";
import { takeUntil } from "./takeUntil";
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils";
import * as L from "."

describe("EventStream.takeUntil", function () {
    describe("should stop on stopper stream", () =>
        expectStreamEvents(
            () => {
                const stopper = later(2, "stop")
                const e = series(1, [1, 2, 3]).pipe(takeUntil(stopper));
                return e
            },
            [1])
    );
    describe("should ignore stopper stream end", () =>
        expectStreamEvents(
            () => {
                const stopper = never()
                const e = series(1, [1, 2, 3]).pipe(takeUntil(stopper));
                return e
            },
            [1, 2, 3])
    ); 
    describe("should ignore later stopper", () =>
        expectStreamEvents(
            () => {
                const stopper = later(4, "stop")
                const e = series(1, [1, 2, 3]).pipe(takeUntil(stopper));
                return e
            },
            [1, 2, 3])
    );        

    it("works in a scenario", async() => {
        const values: any[] = []
        const b = L.bus<number>()
        const stuff = L.never()    
        stuff.pipe(L.takeUntil(b)).log("takeuntil")
        b.forEach(v => values.push(v))
        b.push(4)
        expect(values).toEqual([4])
    })
});

describe("Property.takeUntil", function () {
    describe("should filter values", () =>
        expectPropertyEvents(
            () => {
                const stopper = later(2, "stop")
                const prop = series(1, [1, 2, 3]).pipe(toProperty(0), takeUntil(stopper))
                return prop
            },
            [0, 1])
    );    
});