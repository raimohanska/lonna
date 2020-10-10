import { Event, Observer, Unsub } from "./abstractions";
declare type Dict = {
    [key: string]: any;
};
export declare class Dispatcher<E extends Dict> {
    private _observers;
    private _count;
    private _ended;
    dispatch<X extends keyof E & string>(key: X, value: Event<E[X]>): void;
    on<X extends keyof E & string>(key: X, subscriber: Observer<Event<E[X]>>): Unsub;
    off<X extends keyof E & string>(key: X, subscriber: Observer<Event<E[X]>>): void;
    onObserverCount(subscriber: Observer<number>): import("./abstractions").Callback;
    hasObservers(): boolean;
}
export {};
