import { EventStream, Observer, Unsub, Event } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { Scope } from "./scope";
declare type StreamEvents<V> = {
    "value": V;
};
export declare class StatefulEventStream<V> extends EventStream<V> {
    protected dispatcher: Dispatcher<StreamEvents<V>>;
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
export {};
