import { Event, EventLike, EventStream, EventStreamSeed, EventStreamSource, isEnd, ObservableSeed, Observer, Scope, Subscribe, toEvents, TypeBitfield, T_SCOPED, T_STREAM, Unsub } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Dispatcher } from "./dispatcher";
import { EventStreamSeedImpl, ObservableBase } from "./implementations";

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

export function fromSubscribe<V>(subscribe: Subscribe<V>): EventStreamSeed<V>;
export function fromSubscribe<V>(subscribe: Subscribe<V>, scope: Scope): EventStream<V>;
export function fromSubscribe<V>(subscribe: Subscribe<V>, scope?: Scope): EventStream<V> | EventStreamSeed<V> {
    return applyScopeMaybe(new EventStreamSeedImpl("fromSubscribe(fn)", subscribe), scope)
}

export type FlexibleObserver<V> = (event: EventLike<V>) => void
export type FlexibleSubscribe<V> = (observer: FlexibleObserver<V>) => Unsub

export function toFlexibleObserver<V>(observer: Observer<Event<V>>) {
    return (eventLike: EventLike<V>) => {
        const events = toEvents(eventLike)
        for (const event of events) {
            observer(event)
            if (isEnd(event)) {
                return
            }
        }
    }
}

export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>): EventStreamSeed<V>;
export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>, scope: Scope): EventStream<V>;
export function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>, scope?: Scope): EventStream<V> | EventStreamSeed<V> {
    return applyScopeMaybe(new EventStreamSeedImpl("fromSubscribe(fn)", observer =>
        subscribe(toFlexibleObserver(observer))
    ), scope)
}