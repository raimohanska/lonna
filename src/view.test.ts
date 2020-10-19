import * as B from "."
import { later } from "./later"
import { constant, toProperty } from "./property"
import { expectPropertyEvents, expectStreamEvents, series } from "./test-utils"

describe("Atom.view", () => {
    describe("Array index lenses", () => {
        it("Views into existing and non-existing indices", () => {
            const a = B.atom([1,2,3])
            expect(B.view(a, 1).get()).toEqual(2)
    
            expect(B.view(a, 3).get()).toEqual(undefined)    
        })
        it("Supports removal by setting to undefined", () => {
            const a = B.atom([1,2,3])
            const view = B.view(a, 1)
    
            view.set(undefined)
            expect(a.get()).toEqual([1, 3])            
        })    
    })
    describe("Object key lenses", () => {
        it("Manipulates object properties", () => {
            const a = B.atom({foo: "bar"})
            const view = B.view(a, "foo")
            expect(view.get()).toEqual("bar")
        })    
    })
})

const fooBar = {"foo": "bar"}

describe("Property.view", () => {
    describe("maps property values by string key", () => {
      expectPropertyEvents(
        () => B.view(constant(fooBar), "foo"),
        ["bar"]
      )
    })

    describe("maps property values by unary function", () => {
        expectPropertyEvents(
          () => B.view(constant(fooBar), v => v.foo + " lol"),
          ["bar lol"]
        )
    })

    describe("combines multiple property values by n-ary function", () => {
        expectPropertyEvents(
          () => B.view(constant(fooBar), constant("hello"), (v, h) => h + " " + v.foo + " lol"),
          ["hello bar lol"]
        )
    })
  
    it("toString", () => {
        expect(B.view(constant(fooBar), "foo").toString()).toEqual("constant({foo:bar}).view(foo)")
    });    
});