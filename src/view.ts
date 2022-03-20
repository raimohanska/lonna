import {
  Atom,
  Desc,
  EventStream,
  EventStreamSeed,
  isAtom,
  ObservableSeed,
  Property,
  PropertySeed,
} from "./abstractions"
import { LensedAtom } from "./atom"
import * as L from "./lens"

import { map } from "./map"
import { rename, toString } from "./util"
import {
  Function1,
  Function2,
  Function3,
  Function4,
  Function5,
  Function6,
} from "./abstractions"
import { combine } from "./combine"
import { LensLike, mkLens } from "./lenslike"

// Views for Atom
export function view<A, K extends keyof A>(
  a: Atom<A>,
  key: K
): K extends number ? Atom<A[K] | undefined> : Atom<A[K]>
export function view<A, B>(a: Atom<A>, lens: LensLike<A, B>): Atom<B>

// Views for Property
export function view<A, K extends keyof A>(
  a: Property<A>,
  key: K
): K extends number ? Property<A[K] | undefined> : Property<A[K]>
export function view<A, B>(a: Property<A>, lens: LensLike<A, B>): Property<B>
export function view<V, R>(a: Property<V>, fn: Function1<V, R>): Property<R>
export function view<V, V2, R>(
  a: Property<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, R>
): Property<R>
export function view<V, V2, V3, R>(
  a: Property<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, V3>,
  fn3: Function1<V3, R>
): Property<R>

// Views for 2 or more Properties (combining latest values)
export function view<V, V2, R>(
  a: Property<V>,
  b: Property<V2>,
  fn: Function2<V, V2, R>
): Property<R>
export function view<V, V2, V3, R>(
  a: Property<V>,
  b: Property<V2>,
  c: Property<V3>,
  fn: Function3<V, V2, V3, R>
): Property<R>
export function view<V, V2, V3, V4, R>(
  a: Property<V>,
  b: Property<V2>,
  c: Property<V3>,
  d: Property<V4>,
  fn: Function4<V, V2, V3, V4, R>
): Property<R>
export function view<V, V2, V3, V4, V5, R>(
  a: Property<V>,
  b: Property<V2>,
  c: Property<V3>,
  d: Property<V4>,
  e: Property<V5>,
  fn: Function5<V, V2, V3, V4, V5, R>
): Property<R>
export function view<V, V2, V3, V4, V5, V6, R>(
  a: Property<V>,
  b: Property<V2>,
  c: Property<V3>,
  d: Property<V4>,
  e: Property<V5>,
  f: Property<V6>,
  fn: Function6<V, V2, V3, V4, V5, V6, R>
): Property<R>

// Views for PropertySeed
export function view<A, K extends keyof A>(
  a: PropertySeed<A>,
  key: K
): K extends number ? PropertySeed<A[K] | undefined> : PropertySeed<A[K]>
export function view<A, B>(
  a: PropertySeed<A>,
  lens: LensLike<A, B>
): PropertySeed<B>
export function view<V, R>(
  a: PropertySeed<V>,
  fn: Function1<V, R>
): PropertySeed<R>
export function view<V, V2, R>(
  a: PropertySeed<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, R>
): PropertySeed<R>
export function view<V, V2, V3, R>(
  a: PropertySeed<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, V3>,
  fn3: Function1<V3, R>
): PropertySeed<R>

// Views for EventStream
export function view<A, K extends keyof A>(
  a: EventStream<A>,
  key: K
): K extends number ? EventStream<A[K] | undefined> : EventStream<A[K]>
export function view<A, B>(
  a: EventStream<A>,
  lens: LensLike<A, B>
): EventStream<B>
export function view<V, R>(
  a: EventStream<V>,
  fn: Function1<V, R>
): EventStream<R>
export function view<V, V2, R>(
  a: EventStream<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, R>
): EventStream<R>
export function view<V, V2, V3, R>(
  a: EventStream<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, V3>,
  fn3: Function1<V3, R>
): EventStream<R>

// Views for EventStreamSeed
export function view<A, K extends keyof A>(
  a: EventStreamSeed<A>,
  key: K
): K extends number ? EventStreamSeed<A[K] | undefined> : EventStreamSeed<A[K]>
export function view<A, B>(
  a: EventStreamSeed<A>,
  lens: LensLike<A, B>
): EventStreamSeed<B>
export function view<V, R>(
  a: EventStreamSeed<V>,
  fn: Function1<V, R>
): EventStreamSeed<R>
export function view<V, V2, R>(
  a: EventStreamSeed<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, R>
): EventStreamSeed<R>
export function view<V, V2, V3, R>(
  a: EventStreamSeed<V>,
  fn1: Function1<V, V2>,
  fn2: Function1<V2, V3>,
  fn3: Function1<V3, R>
): EventStreamSeed<R>

export function view<A, B>(...args: any[]): any {
  if (args[args.length - 1] instanceof Function) {
    // properties + function
    let fnIndex = 0
    while (!(args[fnIndex] instanceof Function)) fnIndex++
    const properties = args.slice(0, fnIndex)
    if (properties.length === 1) {
      const property = properties[0]
      let o = property
      for (let i = fnIndex; i < args.length; i++) {
        const fn = args[i]
        o = map(fn)(o)
      }
      const desc = [property, "view", args.slice(fnIndex)] as Desc
      return rename(desc, o)
    } else {
      const fn = args[args.length - 1]
      return rename(["view", [...properties, fn]], combine(properties, fn))
    }
  } else {
    // property/atom + lens
    const atom = args[0]
    const view = args[1]
    let lens = keyOrLens2Lens(view)
    const desc = [atom, "view", [view]] as Desc
    if (isAtom<A>(atom)) {
      return new LensedAtom<A, B>(desc, atom, lens)
    } else {
      return rename(desc, map(lens.get)(atom as any))
    }
  }
}

function keyOrLens2Lens(view: any) {
  if (typeof view === "string") {
    return L.prop<any, any>(view)
  } else if (typeof view === "number") {
    return L.item(view as number)
  } else {
    return mkLens(view)
  }
}
