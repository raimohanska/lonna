import { EventStream, EventStreamSeed, Observer, Unsub, Event, Subscribe, EventLike, toEvents, isEnd, ObservableSeed, EventStreamSource } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Dispatcher } from "./dispatcher";
import { Scope } from "./scope";

type StreamEvents<V> = { "value": V }

// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
export class StatefulEventStream<V> extends EventStream<V> {
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

export class StatelessEventStream<V> extends EventStream<V> {
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
    return applyScopeMaybe(new EventStreamSeed("fromSubscribe(fn)", subscribe), scope)
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
    return applyScopeMaybe(new EventStreamSeed("fromSubscribe(fn)", observer =>
        subscribe(toFlexibleObserver(observer))
    ), scope)
}