import { Event, Observable, ObservableSeed, Observer, TypeBitfield, Unsub, valueObserver } from "./abstractions"
import { Pipeable } from "./pipeable"

export abstract class ObservableSeedBase<V, O extends Observable<any>> extends Pipeable implements ObservableSeed<V, O> {
    abstract _L: TypeBitfield
    desc: string

    constructor(desc: string) {
        super()
        this.desc = desc
    }

    abstract consume(): O;

    toString(): string {
        return this.desc
    }

    forEach(observer: Observer<V>): Unsub {
        return this.consume().subscribe(valueObserver(observer))
    }

    log(message?: string) {
        return this.forEach(v => message === undefined ? console.log(v) : console.log(message, v))
    }
}

export abstract class ObservableBase<V> extends ObservableSeedBase<V, Observable<V>> {
    abstract _L: TypeBitfield
    constructor(desc: string) {
        super(desc)
    }

    abstract subscribe(observer: Observer<Event<V>>): Unsub;

    forEach(observer: Observer<V>): Unsub {
        return this.subscribe(valueObserver(observer))
    }

    consume() {
        return this
    }
}

export abstract class ObservableSeedImpl<V, O extends Observable<any>> extends ObservableSeedBase<V, O> {
    private _source: O | null

    constructor(source: O) {
        super(source.desc)
        this._source = source
    }

    consume(): O {
        if (this._source === null) throw Error(`Seed ${this.desc} already consumed`)
        const result = this._source
        this._source = null
        return result
    }
}

