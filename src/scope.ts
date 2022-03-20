import {
  Scope,
  ScopeFn,
  Subscribe,
  Unsub,
  Observer,
  ObservableSeed,
  T_SCOPE,
} from "./abstractions"
import { Dispatcher } from "./dispatcher"
import { GenericTransformOpScoped } from "./transform"
import { nop } from "./util"

export type MutableScope = Scope & {
  start: () => void
  end: () => void
}

export const globalScope: Scope = mkScope((onIn) => {
  onIn()
})

export function mkScope(scopeFn: ScopeFn): Scope {
  const result = ((seed: ObservableSeed<any, any, any>) =>
    seed.applyScope(result)) as any as Scope
  result.subscribe = scopeFn
  result._L = T_SCOPE
  return result
}

type OnIn = () => Unsub
type OnOut = () => void

export function createScope(): MutableScope {
  let started = false
  let ended = false
  const ins: OnIn[] = []
  const outs: OnOut[] = []

  const fn = (onIn: OnIn) => {
    let onOut: Unsub | null = null
    if (started) {
      onOut = onIn()
      outs.push(onOut)
    } else {
      ins.push(onIn)
    }
  }
  const scope = mkScope(fn) as MutableScope

  scope.start = () => {
    started = true
    for (let i of ins) {
      outs.push(i())
    }
    ins.splice(0)
  }
  scope.end = () => {
    started = false
    ended = true
    for (let o of outs) {
      o()
    }
    outs.splice(0)
  }
  return scope
}

export function intersectionScope(scopes: Scope[]): Scope {
  const nonGlobalScopes = [...new Set(scopes.filter((s) => s !== globalScope))]
  if (nonGlobalScopes.length === 0) return globalScope
  if (nonGlobalScopes.length === 1) return nonGlobalScopes[0]
  return mkScope((onIn: () => Unsub, dispatcher?: Dispatcher<any>) => {
    let started = 0
    let ended = 0
    let onOut: Unsub | null = null
    nonGlobalScopes.forEach((s) => {
      s.subscribe(() => {
        started++
        if (started === nonGlobalScopes.length) {
          onOut = onIn()
        }
        return () => {
          started--
          ended++
          if (ended == 1) {
            onOut!()
          }
        }
      })
    })
  })
}

export const beforeScope = {}
export const afterScope = {}
export type OutOfScope = typeof beforeScope | typeof afterScope

export function checkScope<V>(thing: any, value: V | OutOfScope): V {
  if (value === beforeScope) {
    throw Error(`${thing} not in scope yet`)
  }
  if (value === afterScope) {
    debugger
    throw Error(`${thing} not in scope any more`)
  }
  return value as V
}

export function scopedSubscribe(scope: Scope, subscribe: () => Unsub): Unsub {
  let unsub: Unsub = nop
  let unsubscribed = false

  scope.subscribe(() => {
    if (!unsubscribed) {
      unsub = subscribe()
    }
    return () => {
      unsub()
    }
  })
  return () => {
    unsubscribed = true
    unsub()
    unsub = nop
  }
}

export function scopedSubscribe1<V>(
  scope: Scope,
  subscribe: Subscribe<V>
): Subscribe<V> {
  return (onValue: Observer<V>, onEnd?: Observer<void>) => {
    return scopedSubscribe(scope, () => {
      return subscribe(onValue, onEnd)
    })
  }
}
