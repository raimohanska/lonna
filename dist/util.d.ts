import { Observer, Event, ObservableSeed } from "./abstractions";
export declare function duplicateSkippingObserver<V>(initial: V, observer: Observer<Event<V>>): (event: Event<V>) => void;
export declare function nop(): void;
export declare function remove<A>(xs: A[], x: A): void;
export declare function rename<A extends ObservableSeed<any, any>>(desc: string, observable: A): A;
