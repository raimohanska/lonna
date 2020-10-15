import { Property } from "./abstractions";
export declare type PromiseState<O> = PromisePending | PromiseResolved<O> | PromiseRejected;
export declare type PromisePending = {
    state: "pending";
};
export declare type PromiseResolved<O> = {
    state: "resolved";
    value: O;
};
export declare type PromiseRejected = {
    state: "rejected";
    error: Error;
};
export declare function fromPromise<I>(promise: Promise<I>): Property<PromiseState<I>>;
