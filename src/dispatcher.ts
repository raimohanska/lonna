import { endEvent, Event, isEnd, Observer, Unsub, valueObserver } from "./abstractions";
import { nop } from "./util";

const meta = "__meta"

type Dict = { [key: string]: any }

export class Dispatcher<E extends Dict> {
    private _observers: { [key: string] : [Observer<any>, Observer<void> | undefined][] | undefined } = {}
    private _count = 0
    private _ended = false
    
    dispatch<X extends keyof E & string>(key: X, value: E[X]) {
        // TODO: observers may be mutated while in this loop!
        if (this._observers[key]) for (const s of this._observers[key]!) {
            s[0](value)
        }
    }

    dispatchEnd<X extends keyof E & string>(key: X) {
        // TODO: observers may be mutated while in this loop!
        if (this._observers[key]) for (const s of this._observers[key]!) {
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
                if (!this._observers[key]) return;
                const index = this._observers[key]!.indexOf(pair);
                if (index >= 0) {
                    this._observers[key]!.splice(index, 1);
                    if (this._observers.key?.length === 0) {
                        delete this._observers[key]
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