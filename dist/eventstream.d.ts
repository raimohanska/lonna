import { EventStream, EventStreamSeed, Observer, Unsub } from "./abstractions";
import { Dispatcher } from "./dispatcher";
import { Scope } from "./scope";
declare type StreamEvents<V> = {
    "value": V;
};
export declare class StatefulEventStream<V> extends EventStream<V> {
    protected dispatcher: Dispatcher<StreamEvents<V>>;
    private _scope;
    constructor(desc: string, scope: Scope);
    forEach(observer: Observer<V>): import("./abstractions").Callback;
    getScope(): Scope;
}
export declare class StatelessEventStream<V> extends EventStream<V> {
    private _scope;
    forEach: (observer: Observer<V>) => Unsub;
    constructor(desc: string, forEach: (observer: Observer<V>) => Unsub, scope: Scope);
    constructor(seed: EventStreamSeed<V>, scope: Scope);
    getScope(): Scope;
}
export {};
