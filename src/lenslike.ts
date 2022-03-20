import * as O from "optics-ts"
import * as L from "./lens"

export type LensLike<A, B> =
  | L.Lens<A, B>
  | O.Lens<A, any, B>
  | O.Equivalence<A, any, B>
  | O.Iso<A, any, B>

const supportedOpticsTags = ["Lens", "Equivalence", "Iso"]

export function mkLens<A, B>(lens: LensLike<A, B>): L.Lens<A, B> {
  const tag: string | undefined = (lens as any)._tag
  if (tag) {
    // Optics.ts lens

    if (!supportedOpticsTags.includes(tag)) {
      throw Error(
        `Only ${supportedOpticsTags.join(
          "/"
        )} optics supported from optics-ts. Given optic is a ${tag}.`
      )
    }
    const opticsLens = lens as O.Lens<A, any, B>
    return {
      get: O.get(opticsLens),
      set: (current: A, data: B) => O.set(opticsLens)(data)(current),
    }
  }
  return lens as L.Lens<A, B>
}
