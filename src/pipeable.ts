import { pipe } from "./pipe";

export class Pipeable {
    pipe<A>( a2b: (a: this) => A): A
    pipe<A, B>( a2b: (a: this) => A, b2c: (a: A) => B): B
    pipe<A, B, C>( a2b: (a: this) => A, b2c: (a: A) => B, c2d: (b: B) => C): C
    pipe<A, B, C, D>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
    ): D
    pipe<A, B, C, D, E>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
    ): E
    pipe<A, B, C, D, E, F>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
    ): F
    pipe<A, B, C, D, E, F, G>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
    ): G
    pipe<A, B, C, D, E, F, G, H>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
    ): H
    pipe<A, B, C, D, E, F, G, H, I>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
      i2j: (h: H) => I,
    ): I
    pipe<A, B, C, D, E, F, G, H, I, J>(
      a2b: (a: this) => A,
      b2c: (a: A) => B,
      c2d: (b: B) => C,
      d2e: (c: C) => D,
      e2f: (d: D) => E,
      f2g: (e: E) => F,
      g2h: (f: F) => G,
      h2i: (g: G) => H,
      i2j: (h: H) => I,
      j2k: (i: I) => J,
    ): J    
    pipe(...args: any): any {
        return pipe(this, ...(args as [any]))
    }
}