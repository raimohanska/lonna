import { EventStream, EventStreamSeed, Observer, Unsub, Event, Subscribe, EventLike } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { Scope } from "./scope";
declare type StreamEvents<V> = {
    "value": V;
};
export declare class StatefulEventStream<V> extends EventStream<V> {
    dispatcher: Dispatcher<StreamEvents<V>>;
    private _scope;
    constructor(desc: string, scope: Scope);
    subscribe(observer: Observer<Event<V>>): import("./abstractions").Callback;
    getScope(): Scope;
}
export declare class StatelessEventStream<V> extends EventStream<V> {
    private _scope;
    subscribe: (observer: Observer<Event<V>>) => Unsub;
    constructor(desc: string, subscribe: (observer: Observer<Event<V>>) => Unsub, scope: Scope);
    getScope(): Scope;
}
export declare class SeedToStream<V> extends StatefulEventStream<V> {
    constructor(seed: EventStreamSeed<V>, scope: Scope);
}
export declare function fromSubscribe<V>(subscribe: Subscribe<V>): EventStreamSeed<V>;
export declare function fromSubscribe<V>(subscribe: Subscribe<V>, scope: Scope): EventStream<V>;
export declare type FlexibleObserver<V> = (event: EventLike<V>) => void;
export declare type FlexibleSubscribe<V> = (observer: FlexibleObserver<V>) => Unsub;
export declare function toFlexibleObserver<V>(observer: Observer<Event<V>>): (eventLike: EventLike<V>) => void;
export declare function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>): EventStreamSeed<V>;
export declare function fromFlexibleSubscibe<V>(subscribe: FlexibleSubscribe<V>, scope: Scope): EventStream<V>;
export {};
