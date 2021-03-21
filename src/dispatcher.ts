import { endEvent, Event, isEnd, Observer, Unsub, valueObserver } from "./abstractions";
import { nop } from "./util";

const meta = "__meta"

type Dict = { [key: string]: any }

export class Dispatcher<E extends Dict> {
    private _observers: { [key: string] : [Observer<any>, Observer<void> | undefined][] | undefined } = {}
    private _count = 0
    private _ended = false
    
    // TODO: what to do with dispatch calls during dispatch? 
    // Relatedly, observer removal is not fully optimized (mutation is okay unless dispatching)
    dispatch<X extends keyof E & string>(key: X, value: E[X]) {        
        const observers = this._observers[key]
        if (observers) for (const s of observers) {
            s[0](value)
        }
    }

    dispatchEnd<X extends keyof E & string>(key: X) {
        const observers = this._observers[key]
        if (observers) for (const s of observers) {
            s[1] && s[1]()
        }
        this._ended = true
    }

    on<X extends keyof E & string>(key: X, onValue: Observer<E[X]>, onEnd: Observer<void> = nop): Unsub {
        if (!this._observers[key]) this._observers[key] = [];        
        const pair = [onValue, onEnd] as [Observer<any>, Observer<void>]
        if (this._ended) {
            onEnd()
            return nop
        } else {
            this._observers[key]!.push(pair)
            if (key !== meta) {
                this._count++
                if (this._count == 1) {
                    this.dispatch(meta, 1 as any)
                }
            }
            return () => {
                let observers = this._observers[key]
                if (!observers) return;
                const index = observers.indexOf(pair);
                if (index >= 0) {
                    observers = [...observers.slice(0, index), ...observers.slice(index + 1)]
                    if (observers.length === 0) {
                        delete this._observers[key]
                    } else {
                        this._observers[key] = observers
                    }
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