import { endEvent, Event, isValue, Observer, Scope } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import {
  transform,
  Transformer,
  GenericTransformOp,
  GenericTransformOpScoped,
} from "./transform"
import { nop } from "./util"

export function take(count: number): GenericTransformOp
export function take(count: number, scope: Scope): GenericTransformOpScoped
export function take(count: number, scope?: Scope): any {
  return transform(["take", [count]], takeT(count), scope as Scope)
}

function takeT<A>(count: number): Transformer<A, A> {
  return {
    changes:
      (subscribe) =>
      (onValue, onEnd = nop) => {
        return subscribe(
          (value) => {
            count--
            if (count > 0) {
              onValue(value)
            } else {
              if (count === 0) {
                onValue(value)
                onEnd()
              }
            }
          },
          onEnd // TODO: shielding for double ends missing
        )
      },
    init: (value: A) => {
      return value
    },
  }
}
