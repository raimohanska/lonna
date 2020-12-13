import * as B from ".";
import { bus } from "./bus";
import { tap, toProperty } from "./index";
import { expectPropertyEvents, series } from "./test-utils";
import { nop } from "./util";

const times2 = (x: number) => x * 2;
const toString = (x: number) => "" + x;

describe("Property.tap", () => {
  describe("Doesn't affect values", () => {
    expectPropertyEvents(
      () => {
        const x = series(1, [2]).pipe(toProperty(1), tap(toString))
        return x
      },
      [1, 2])
  })
  it("Calls given function for values", () => {
    const numbers: number[] = []
    function store(n: number) {
      numbers.push(n)
    }
    const b = bus<number>()
    const tapped = b.pipe(tap(store))
    tapped.forEach(nop)
    b.push(1)
    b.push(2)
    expect(numbers).toEqual([1,2])
  })
});