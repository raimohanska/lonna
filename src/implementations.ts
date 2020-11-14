import { isValue, Event, Observable, ObservableSeed, Observer, PropertySeed, PropertySource, Subscribe, TypeBitfield, T_PROPERTY, T_SEED, T_COLD, Unsub, valueEvent, T_STREAM, EventStreamSource, EventStreamSeed, AtomSource, T_ATOM, AtomSeed, valueObserver, T_SCOPED, ScopedObservable, Property, Scope } from "./abstractions"
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
/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class PropertySeedImpl<V> extends ObservableSeedImpl<V, PropertySource<V>> implements PropertySeed<V> {
    _L: TypeBitfield = T_PROPERTY | T_SEED
    constructor(desc: string, get: () => V, onChange: Subscribe<V>) {
        super(new PropertySourceImpl(desc, get, onChange))
    }  
}

export abstract class PropertyBase<V> extends ObservableBase<V> implements Property<V>, PropertySeed<V>, PropertySource<V> {
    constructor(desc: string) {
        super(desc)
    }

    abstract getScope(): Scope;

    abstract get(): V

    abstract onChange(observer: Observer<Event<V>>): Unsub;

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call
    subscribe(observer: Observer<Event<V>>): Unsub {        
        const unsub = this.onChange(observer)
        observer(valueEvent(this.get()))
        return unsub
    }    
}


export class PropertySourceImpl<V> extends ObservableBase<V> implements PropertySource<V> {
    _L: TypeBitfield = T_PROPERTY | T_COLD
    private _started = false
    private _subscribed = false
    private _get: () => V

    onChange_: Subscribe<V>;

    get() {
        if (this._started) throw Error("PropertySeed started already: " + this)
        return this._get()
    }

    constructor(desc: string, get: () => V, onChange: Subscribe<V>) {
        super(desc)
        this._get = get;
        this.onChange_ = onChange;
    }

    onChange(observer: Observer<Event<V>>): Unsub {                
        if (this._subscribed) throw Error("Multiple subscriptions not allowed to PropertySeed instance: " + this)
        this._subscribed = true
        return this.onChange_(event => {
            if (isValue(event)) {
                this._started = true
            }
            observer(event)
        })
    }

    // In Properties and PropertySeeds the subscribe observer gets also the current value at time of call. For PropertySeeds, this is a once-in-a-lifetime opportunity though.
    subscribe(observer: Observer<Event<V>>): Unsub {        
        const unsub = this.onChange(observer)
        observer(valueEvent(this.get()))
        return unsub
    }       
}


export class EventStreamSourceImpl<V> extends ObservableBase<V> {
    _L: TypeBitfield = T_STREAM | T_COLD
    subscribe: (observer: Observer<Event<V>>) => Unsub

    constructor(desc: string, subscribe: Subscribe<V>) {
        super(desc)
        this.subscribe = subscribe
    }
}


export class EventStreamSeedImpl<V> extends ObservableSeedImpl<V, EventStreamSource<V>> implements EventStreamSeed<V> {
    _L: TypeBitfield = T_STREAM | T_SEED
    constructor(desc: string, subscribe: Subscribe<V>) {
        super(new EventStreamSourceImpl(desc, subscribe))
    }
}


/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSeedImpl<V> extends ObservableSeedImpl<V, AtomSource<V>>{
    _L: TypeBitfield = T_ATOM | T_SEED
    constructor(desc: string, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(new AtomSourceImpl(desc, get, subscribe, set))
    }  
}


/**
 *  Input source for a StatefulProperty. Returns initial value and supplies changes to observer.
 *  Must skip duplicates!
 **/
export class AtomSourceImpl<V> extends PropertySourceImpl<V> implements AtomSource<V> {
    _L: TypeBitfield = T_ATOM | T_COLD
    set: (updatedValue: V) => void;
    constructor(desc: string, get: () => V, subscribe: Subscribe<V>, set: (updatedValue: V) => void) {
        super(desc, get, subscribe)
        this.set = set
    }
}
