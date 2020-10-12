import { EventStream, EventStreamSeed, Observer, Unsub, Event, Subscribe } from "./abstractions";
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
    constructor(seed: EventStreamSeed<V>, scope: Scope) { 
        super(seed.desc, scope)
        const source = seed.consume()
        scope(
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