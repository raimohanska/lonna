import { Event, EventLike, EventStream, EventStreamSeed, EventStreamSource, isEnd, ObservableSeed, Observer, Scope, Subscribe, toEvents, TypeBitfield, T_COLD, T_SCOPED, T_SEED, T_STREAM, Unsub } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Dispatcher } from "./dispatcher";
import { ObservableBase, ObservableSeedImpl } from "./implementations";

type StreamEvents<V> = { "value": V }

export abstract class EventStreamBase<V> extends ObservableBase<V> implements EventStream<V> {
    _L: TypeBitfield = T_STREAM | T_SCOPED
    abstract getScope(): Scope
}

// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
export class StatefulEventStream<V> extends EventStreamBase<V> {
    dispatcher = new Dispatcher<StreamEvents<V>>();
    private _scope: Scope;
    constructor(desc: string, scope: Scope) { 
        super(desc) 
        this._scope = scope
    }

    subscribe(observer: Observer<Event<V>>) {
        return this.dispatcher.on("value", observer)
    }
    getScope() {
        return this._scope
    }
}

export class StatelessEventStream<V> extends EventStreamBase<V> {
    private _scope: Scope;
    subscribe: (observer: Observer<Event<V>>) => Unsub;

    constructor(desc: string, subscribe: (observer: Observer<Event<V>>) => Unsub, scope: Scope) {
        super(desc) 
        this._scope = scope
        this.subscribe = subscribe
    }

    getScope() {
        return this._scope
    }
}

export class SeedToStream<V> extends StatefulEventStream<V> {
    constructor(seed: ObservableSeed<V, EventStreamSource<V>>, scope: Scope) { 
        super(seed.desc, scope)
        const source = seed.consume()
        scope.subscribe(
            () => source.subscribe(v => this.dispatcher.dispatch("value", v)),
            this.dispatcher            
        )
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