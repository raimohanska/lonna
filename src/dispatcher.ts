import {
  Callback,
  endEvent,
  Event,
  isEnd,
  Observer,
  Unsub,
  valueObserver,
} from "./abstractions"
import { nop } from "./util"

const meta = "__meta"

type Dict = { [key: string]: any }

type ObserverPair = [Observer<any>, Observer<void>]

// TODO: there's likely a lot of room for optimization here
type ObserverList = ObserverPair[]
function DispatchList() {
  let _observers: ObserverList = []
  let dispatching: ObserverList | null = null
  let todos: Callback[] = []
  let removed: Set<ObserverPair> = new Set()
  function dispatch(index: number, value: any) {
    if (dispatching) {
      todos.push(() => dispatch(index, value))
      return
    }
    dispatching = _observers
    if (dispatching)
      for (const pair of dispatching) {
        if (removed.has(pair)) {
          // Skip observers removed during dispatch
        } else {
          pair[index] && pair[index](value)
        }
      }
    removed.clear()
    dispatching = null
    const leftOvers = todos
    todos = []
    leftOvers.forEach((f) => f())
  }
  function cloneIfNecessary() {
    if (dispatching === _observers) {
      _observers = [..._observers]
    }
  }
  function remove(pair: ObserverPair) {
    cloneIfNecessary()
    const index = _observers.indexOf(pair)
    if (index >= 0) {
      if (dispatching) {
        removed.add(pair)
      }
      _observers.splice(index, 1)
      return true
    }
    return false
  }
  function add(pair: ObserverPair) {
    cloneIfNecessary()
    _observers.push(pair)
  }
  return {
    dispatch,
    add,
    remove,
  }
}

type DispatchList = ReturnType<typeof DispatchList>

export class Dispatcher<E extends Dict> {
  private _observers: { [key: string]: DispatchList } = {}
  private _count = 0
  private _ended = false

  dispatch<X extends keyof E & string>(key: X, value: E[X]) {
    const list = this._observers[key]
    if (list) {
      list.dispatch(0, value)
    }
  }

  dispatchEnd<X extends keyof E & string>(key: X) {
    const list = this._observers[key]
    if (list) {
      list.dispatch(1, undefined)
    }
    this._ended = true
  }

  on<X extends keyof E & string>(
    key: X,
    onValue: Observer<E[X]>,
    onEnd: Observer<void> = nop
  ): Unsub {
    if (!this._observers[key]) this._observers[key] = DispatchList()
    const pair = [onValue, onEnd] as ObserverPair
    if (this._ended) {
      onEnd()
      return nop
    } else {
      this._observers[key].add(pair)
      if (key !== meta) {
        this._count++
        if (this._count == 1) {
          this.dispatch(meta, 1 as any)
        }
      }
      return () => {
        let list = this._observers[key]
        if (!list) return
        if (list.remove(pair)) {
          if (key !== meta) {
            this._count--
            if (this._count == 0) {
              this.dispatch(meta, 0 as any)
            }
          }
        }
      }
    }
  }

  onObserverCount(subscriber: Observer<number>) {
    return this.on(meta, subscriber as any, undefined)
  }

  hasObservers(): boolean {
    return this._count > 0
  }
}
