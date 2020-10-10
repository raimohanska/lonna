import { Event, Observer, Unsub, valueObserver } from "./abstractions";

const meta = "__meta"
type META = typeof meta

type Dict = { [key: string]: any }

// TODO: keep "ended" state, dispatch EndEvent on subscribe?

export class Dispatcher<E extends Dict> {
    private _observers: { [key: string] : Observer<any>[] | undefined } = {}
    private _count = 0

    dispatch<X extends keyof E & string>(key: X, value: Event<E[X]>) {
        if (this._observers[key]) for (const s of this._observers[key]!) {
            s(value)
        }
    }

    on<X extends keyof E & string>(key: X, subscriber: Observer<Event<E[X]>>): Unsub {
        if (!this._observers[key]) this._observers[key] = [];
        if (this._observers[key]?.includes(subscriber)) {
            console.warn("Already subscribed")
        }
        this._observers[key]!.push(subscriber)
        if (key !== meta) {
            this._count++
            if (this._count == 1) {
                this.dispatch(meta, 1 as any)
            }
        }
        return () => this.off(key, subscriber)
    }

    off<X extends keyof E & string>(key: X, subscriber: Observer<Event<E[X]>>) {
        if (!this._observers[key]) return;
        const index = this._observers[key]!.indexOf(subscriber);
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
        return this.on(meta, valueObserver(subscriber))
    }

    hasObservers(): boolean {
        return this._count > 0
    }
}