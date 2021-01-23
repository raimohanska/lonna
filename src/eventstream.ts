import { Event, EventLike, EventStream, EventStreamSeed, EventStreamSource, isEnd, ObservableSeed, Observer, Scope, Subscribe, toEvents, TypeBitfield, T_SOURCE, T_SCOPED, T_SEED, T_STREAM, Unsub, Desc } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Dispatcher } from "./dispatcher";
import { ObservableBase, ObservableSeedImpl } from "./observable";

type StreamEvents<V> = { "value": V }

export abstract class EventStreamBase<V> extends ObservableBase<V> implements EventStream<V> {
    observableType() { return "EventStream" }
    _L: TypeBitfield = T_STREAM | T_SCOPED
    abstract getScope(): Scope
}

// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
export class StatefulEventStream<V> extends EventStreamBase<V> {
    protected dispatcher = new Dispatcher<StreamEvents<V>>();
    private _scope: Scope;
    constructor(desc: Desc, scope: Scope) { 
        super(desc) 
        this._scope = scope
    }

    subscribe(onValue: Observer<V>, onEnd?: Observer<void>) {
        return this.dispatcher.on("value", onValue, onEnd)
    }
    getScope() {
        return this._scope
    }
}

export class StatelessEventStream<V> extends EventStreamBase<V> {
    private _scope: Scope;
    subscribe: Subscribe<V>;

    constructor(desc: Desc, subscribe: Subscribe<V>, scope: Scope) {
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
            () => source.subscribe(v => this.dispatcher.dispatch("value", v), () => this.dispatcher.dispatchEnd("value")),
            this.dispatcher            
        )
    }
}

export class EventStreamSourceImpl<V> extends ObservableBase<V> {
    observableType() { return "EventStreamSource" }
    _L: TypeBitfield = T_STREAM | T_SOURCE
    subscribe: Subscribe<V>

    constructor(desc: Desc, subscribe: Subscribe<V>) {
        super(desc)
        this.subscribe = subscribe
    }
}


export class EventStreamSeedImpl<V> extends ObservableSeedImpl<V, EventStreamSource<V>> implements EventStreamSeed<V> {
    observableType() { return "EventStreamSeed" }
    _L: TypeBitfield = T_STREAM | T_SEED
    constructor(desc: Desc, subscribe: Subscribe<V>) {
        super(new EventStreamSourceImpl(desc, subscribe))
    }
}