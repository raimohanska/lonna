import { isObservable, isObservableSeed, Observable, ObservableSeed } from "./abstractions"
import { constant } from "./property"

/** @hidden */
export function argumentsToObservables<V, P extends ObservableSeed<Observable<any>>>(args: (P | P[] | V)[]): P[] {
  args = <any>(Array.prototype.slice.call(args))
  return args.flatMap(<any>singleToObservables)
}

function singleToObservables<T>(x: (ObservableSeed<any> | ObservableSeed<any>[] | T)): Observable<any>[] {
  if (isObservableSeed(x)) {
    return [x.consume()]
  } else if (x instanceof Array) {
    return argumentsToObservables(<any>x)
  } else {
    return <any>[constant(x)]
  }
}

/** @hidden */
export function argumentsToObservablesAndFunction<V, P extends ObservableSeed<any>>(args: any[]): [P[], (...args: any[]) => V] {
  if (args[0] instanceof Function) {
    return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
  } else {
    return [argumentsToObservables(<any>Array.prototype.slice.call(args, 0, args.length - 1)), args[args.length - 1] ];
  }
}
