import { Observer } from "./abstractions";
export declare function nop(): void;
export declare function duplicateSkippingObserver<V>(initial: V, observer: Observer<V>): (newValue: V) => void;
