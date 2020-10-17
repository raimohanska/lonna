import { endEvent, Event, isEnd, Observer, Unsub, valueObserver } from "./abstractions";
import { nop } from "./util";

const meta = "__meta"

type Dict = { [key: string]: any }

export class Dispatcher<E extends Dict> {
    private _observers: { [key: string] : Observer<any>[] | undefined } = {}
    private _count = 0
    private _ended = false
    
    dispatch<X extends keyof E & string>(key: X, value: Event<E[X]>) {
        // TODO: observers may be mutated while in this loop!
        if (this._observers[key]) for (const s of this._observers[key]!) {
            s(value)
        }
        if (isEnd(value)) {
            this._ended = true
        }
    }

    on<X extends keyof E & string>(key: X, observer: Observer<Event<E[X]>>): Unsub {
        if (!this._observers[key]) this._observers[key] = [];
        if (this._observers[key]?.includes(observer)) {
            console.warn("Already subscribed")
        }
        if (this._ended) {
            observer(endEvent)
            return nop
        } else {
            this._observers[key]!.push(observer)
            if (key !== meta) {
                this._count++
                if (this._count == 1) {
                    this.dispatch(meta, 1 as any)
                }
            }
            return () => this.off(key, observer)
        }
    }

    off<X extends keyof E & string>(key: X, observer: Observer<Event<E[X]>>) {
        if (!this._observers[key]) return;
        const index = this._observers[key]!.indexOf(observer);
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

    onObserverCount(subscriber: Observer<number>) {
        return this.on(meta, subscriber as any)
    }

    hasObservers(): boolean {
        return this._count > 0
    }
}