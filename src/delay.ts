import { Scope } from "./abstractions"
import { flatMap } from "./flatmap"
import { later } from "./later"
import { GenericTransformOp, GenericTransformOpScoped } from "./transform"
import { transformChanges } from "./transformchanges"

export function delay<A>(delay: number): GenericTransformOp
export function delay<A>(delay: number, scope: Scope): GenericTransformOpScoped
export function delay<A>(delay: number, scope?: Scope): any {
  return transformChanges(
    ["delay", [delay]],
    (changes) => flatMap((value) => later(delay, value))(changes),
    scope as any
  )
}
