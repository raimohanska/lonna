import { bufferWithTime } from "./buffer"
import { map } from "./map"
import { Scope } from "./abstractions"
import { GenericTransformOp, GenericTransformOpScoped } from "./transform"
import { transformChanges } from "./transformchanges"

export function throttle<A>(delay: number): GenericTransformOp
export function throttle<A>(
  delay: number,
  scope: Scope
): GenericTransformOpScoped
export function throttle<A>(delay: number, scope?: Scope): any {
  return transformChanges(
    ["throttle", [delay]],
    (changes) =>
      map((values: any) => values[values.length - 1])(
        bufferWithTime(delay)(changes)
      ),
    scope as any
  )
}
