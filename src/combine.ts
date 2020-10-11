import { Observer, Property, Event, isValue, valueEvent, endEvent, PropertySeed } from "./abstractions";
import { StatelessProperty } from "./property";
import { globalScope } from "./scope";
import { argumentsToObservablesAndFunction } from "./argumentstoobservables"

export type Function0<R> = () => R;
export type Function1<T1, R> = (t1: T1) => R;
export type Function2<T1, T2, R> = (t1: T1, t2: T2) => R;
export type Function3<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
export type Function4<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
export type Function5<T1, T2, T3, T4, T5, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R;
export type Function6<T1, T2, T3, T4, T5, T6, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R;


/**
  Combines given *n* Properties and
  EventStreams using the given n-ary function `f(v1, v2 ...)`.

  To calculate the current sum of three numeric Properties, you can do

```js
function sum3(x,y,z) { return x + y + z }
    combine(sum3, p1, p2, p3)
```
*/
export type PropertyLike<V> = Property<V> | PropertySeed<V>

export function combineAsArray<V>(observables: Property<V>[]): Property<V[]>;
export function combineAsArray<V>(observables: PropertySeed<V>[]): PropertySeed<V[]>;

export function combineAsArray<V>(observables: Property<V>[] | PropertySeed<V>[]): PropertyLike<V[]> {
  return combine(observables as any, (...xs: V[]) => xs)
}

export function combine<R>(fn: Function0<R>): Property<R>
export function combine<V, R>(a: Property<V>, fn: Function1<V, R>): Property<R>
export function combine<V, V2, R>(a: Property<V>, b: Property<V2>, fn: Function2<V, V2, R>): Property<R>
export function combine<V, V2, V3, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, fn: Function3<V, V2, V3, R>): Property<R>
export function combine<V, V2, V3, V4, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, fn: Function4<V, V2, V3, V4, R>): Property<R>
export function combine<V, V2, V3, V4, V5, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, fn: Function5<V, V2, V3, V4, V5, R>): Property<R>
export function combine<V, V2, V3, V4, V5, V6, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, f: Property<V6>, fn: Function6<V, V2, V3, V4, V5, V6, R>): Property<R>
export function combine<V, R>(properties: Property<V>[], fn: (...values: V[]) => R): Property<R>

export function combine<V, R>(fn: Function1<V, R>, a: Property<V>): Property<R>
export function combine<V, V2, R>(fn: Function2<V, V2, R>, a: Property<V>, b: Property<V2>): Property<R>
export function combine<V, V2, V3, R>(fn: Function3<V, V2, V3, R>, a: Property<V>, b: Property<V2>, c: Property<V3>): Property<R>
export function combine<V, V2, V3, V4, R>(fn: Function4<V, V2, V3, V4, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>): Property<R>
export function combine<V, V2, V3, V4, V5, R>(fn: Function5<V, V2, V3, V4, V5, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>): Property<R>
export function combine<V, V2, V3, V4, V5, V6, R>(fn: Function6<V, V2, V3, V4, V5, V6, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, f: Property<V6>): Property<R>
export function combine<V, R>(fn: (...values: V[]) => R, Propertys: Property<any>[]): Property<R>

export function combine<V, R>(a: PropertySeed<V>, fn: Function1<V, R>): PropertySeed<R>
export function combine<V, V2, R>(a: PropertySeed<V>, b: PropertySeed<V2>, fn: Function2<V, V2, R>): PropertySeed<R>
export function combine<V, V2, V3, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, fn: Function3<V, V2, V3, R>): PropertySeed<R>
export function combine<V, V2, V3, V4, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, fn: Function4<V, V2, V3, V4, R>): PropertySeed<R>
export function combine<V, V2, V3, V4, V5, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, fn: Function5<V, V2, V3, V4, V5, R>): PropertySeed<R>
export function combine<V, V2, V3, V4, V5, V6, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, f: PropertySeed<V6>, fn: Function6<V, V2, V3, V4, V5, V6, R>): PropertySeed<R>
export function combine<V, R>(properties: PropertySeed<V>[], fn: (...values: V[]) => R): PropertySeed<R>

export function combine<V, R>(fn: Function1<V, R>, a: PropertySeed<V>): PropertySeed<R>
export function combine<V, V2, R>(fn: Function2<V, V2, R>, a: PropertySeed<V>, b: PropertySeed<V2>): PropertySeed<R>
export function combine<V, V2, V3, R>(fn: Function3<V, V2, V3, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>): PropertySeed<R>
export function combine<V, V2, V3, V4, R>(fn: Function4<V, V2, V3, V4, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>): PropertySeed<R>
export function combine<V, V2, V3, V4, V5, R>(fn: Function5<V, V2, V3, V4, V5, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>): PropertySeed<R>
export function combine<V, V2, V3, V4, V5, V6, R>(fn: Function6<V, V2, V3, V4, V5, V6, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, f: PropertySeed<V6>): PropertySeed<R>
export function combine<V, R>(fn: (...values: V[]) => R, Propertys: PropertySeed<any>[]): PropertySeed<R>


export function combine<Out>(...args: any[]): PropertyLike<Out> {
  const [properties, combinator] = argumentsToObservablesAndFunction<Out, Property<Out>>(args);

  function getCurrentArray(): any[] {
    return properties.map(s => s.get())
  }
  
  const get = () => combinator(...getCurrentArray())
  function subscribe(observer: Observer<Event<Out>>) {
    let endCount = 0
    const unsubs = properties.map((src, i) => {
      return src.onChange((event: Event<any>) => {
          if (isValue(event)) {
            currentArray[i] = event.value
            observer(valueEvent(combinator(...currentArray)))
          } else {
            endCount++
            if (endCount == properties.length) {
              observer(endEvent)
            }
          }
      })
    })        
    let currentArray = getCurrentArray()
    
    return () => {
        unsubs.forEach(f => f())
    }    
  }

  const desc = `combine(${properties}, fn)`
  if (properties.length === 0 || properties[0] instanceof Property) {
    const scope = (properties.length === 0) ? globalScope :properties[0].getScope()
    return new StatelessProperty<Out>(desc, get, subscribe, scope);
  } else {
    return new PropertySeed<Out>(desc, get, subscribe)
  } 
};