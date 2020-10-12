import { Observable, ObservableSeed } from "./abstractions";
/** @hidden */
export declare function argumentsToObservables<V, P extends ObservableSeed<V, Observable<any>>>(args: (P | P[] | V)[]): P[];
/** @hidden */
export declare function argumentsToObservablesAndFunction<V, P extends ObservableSeed<V, any>>(args: any[]): [P[], (...args: any[]) => V];
