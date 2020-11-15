import * as B from "."
import { isEventStream, isEventStreamSeed, isProperty, isPropertySeed, isPropertySource, Observable, PropertySeed, PropertySource } from "./abstractions"
import { constant } from "./constant"
import { globalScope } from "./scope"
import { nop } from "./util"

describe("Property", () => {
    describe("Basics", () => {
        it ("Uses inheritance", () => {
            const p = constant(1)
            expect(isProperty(p)).toEqual(true)
            expect(isPropertySeed(p)).toEqual(true)
            expect(isPropertySource(p)).toEqual(true)
            expect(isEventStream(p)).toEqual(false)
            expect(isEventStreamSeed(p)).toEqual(false)

            // Making sure the methods are available through these interfaces
            p.forEach(nop);
            (p as Observable<number>).forEach(nop);
            (p as Observable<number>).subscribe(nop);
            (p as Observable<number>).log;
            (p as Observable<number>).desc;
            (p as PropertySeed<number>).forEach(nop);
            (p as PropertySeed<number>).log;
            (p as PropertySeed<number>).desc;
            (p as PropertySource<number>).forEach(nop);
            (p as PropertySource<number>).subscribe(nop);
            (p as PropertySource<number>).log;
            (p as PropertySource<number>).desc;
        })

        it ("Has synchronous current value", () => {
            const prop = B.toProperty("hello", globalScope)(B.never<number>())
            expect(prop.get()).toEqual("hello")
        })
    })
})
