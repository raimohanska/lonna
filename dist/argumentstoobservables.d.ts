import { Observable } from "./abstractions";
/** @hidden */
export declare function argumentsToObservables<V, P extends Observable<any>>(args: (P | P[] | V)[]): P[];
/** @hidden */
export declare function argumentsToObservablesAndFunction<V, P extends Observable<any>>(args: any[]): [P[], (...args: any[]) => V];
