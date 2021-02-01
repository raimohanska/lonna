import { Scope, ScopedObservable } from "./abstractions";
import { isObservableSeed, Observable, ObservableSeed } from "./index";
import { constant } from "./index";

/** @hidden */
export function argumentsToObservables<V, P extends ObservableSeed<V, Observable<any>, ScopedObservable<any>>>(args: (P | P[] | V)[]): P[] {
  args = <any>(Array.prototype.slice.call(args))
  return args.flatMap(<any>singleToObservables)
}

function singleToObservables<T>(x: (ObservableSeed<any, any, any> | ObservableSeed<any, any, any>[] | T)): Observable<any>[] {
  if (isObservableSeed(x)) {
    return [x.consume()]
  } else if (x instanceof Array) {
    return argumentsToObservables(<any>x) as any
  } else {
    return <any>[constant(x)]
  }
}

/** @hidden */
export function argumentsToObservablesAndFunction<V, P extends ObservableSeed<V, any, any>>(args: any[]): [P[], (...args: any[]) => V] {
  if (args[0] instanceof Function) {
    return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
  } else {
    return [argumentsToObservables(<any>Array.prototype.slice.call(args, 0, args.length - 1)), args[args.length - 1] ];
  }
}
