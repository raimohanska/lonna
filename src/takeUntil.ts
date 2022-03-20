import { EventStream, EventStreamSeed, Scope } from "./abstractions"
import {
  GenericTransformOp,
  Transformer,
  transform,
  GenericTransformOpScoped,
} from "./transform"
import { nop } from "./util"

export function takeUntil(stopper: EventStreamSeed<any>): GenericTransformOp
export function takeUntil(
  stopper: EventStreamSeed<any>,
  scope: Scope
): GenericTransformOpScoped
export function takeUntil(stopper: EventStreamSeed<any>, scope?: Scope): any {
  return transform(
    ["takeUntil", [stopper]],
    takeUntilT(stopper),
    scope as Scope
  )
}

function takeUntilT<A>(stopper: EventStreamSeed<any>): Transformer<A, A> {
  return {
    changes:
      (subscribe) =>
      (onValue, onEnd = nop) => {
        let unsubscribed = false
        let ended = false
        const end = () => {
          if (!ended) {
            ended = true
            onEnd()
          }
        }
        const unsubSrc = subscribe(onValue, end)
        const unsubStopper = stopper.forEach(() => {
          end()
          unsub()
        })
        const unsub = () => {
          if (!unsubscribed) {
            unsubSrc()
            unsubStopper()
            unsubscribed = true
          }
        }

        return unsub
      },
    init: (value: A) => {
      return value
    },
  }
}
