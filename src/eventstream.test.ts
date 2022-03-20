import * as B from "."
import {
  isAtomSeed,
  isEventStream,
  isEventStreamSeed,
  isEventStreamSource,
  isProperty,
  isPropertySeed,
  isPropertySource,
} from "./abstractions"

describe("EventStream", () => {
  describe("Basics", () => {
    it("Uses inheritance", () => {
      expect(isProperty(B.never())).toEqual(false)
      expect(isEventStream(B.never())).toEqual(true)
      expect(isEventStreamSource(B.never())).toEqual(true)
      expect(isEventStreamSeed(B.never())).toEqual(true)
      expect(isPropertySource(B.never())).toEqual(false)
      expect(isPropertySeed(B.never())).toEqual(false)
      expect(isAtomSeed(B.never())).toEqual(false)
    })
  })
})
