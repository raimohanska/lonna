import { Property, PropertySeed, Function0, Function1, Function2, Function3, Function4, Function5, Function6 } from "./abstractions";
/**
  Combines given *n* Properties and
  EventStreams using the given n-ary function `f(v1, v2 ...)`.

  To calculate the current sum of three numeric Properties, you can do

```js
function sum3(x,y,z) { return x + y + z }
    combine(sum3, p1, p2, p3)
```
*/
export declare type PropertyLike<V> = Property<V> | PropertySeed<V>;
export declare function combineAsArray<V>(observables: Property<V>[]): Property<V[]>;
export declare function combineAsArray<V>(observables: PropertySeed<V>[]): PropertySeed<V[]>;
export declare function combine<R>(fn: Function0<R>): Property<R>;
export declare function combine<V, R>(a: Property<V>, fn: Function1<V, R>): Property<R>;
export declare function combine<V, V2, R>(a: Property<V>, b: Property<V2>, fn: Function2<V, V2, R>): Property<R>;
export declare function combine<V, V2, V3, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, fn: Function3<V, V2, V3, R>): Property<R>;
export declare function combine<V, V2, V3, V4, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, fn: Function4<V, V2, V3, V4, R>): Property<R>;
export declare function combine<V, V2, V3, V4, V5, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, fn: Function5<V, V2, V3, V4, V5, R>): Property<R>;
export declare function combine<V, V2, V3, V4, V5, V6, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, f: Property<V6>, fn: Function6<V, V2, V3, V4, V5, V6, R>): Property<R>;
export declare function combine<V, R>(properties: Property<V>[], fn: (...values: V[]) => R): Property<R>;
export declare function combine<V, R>(fn: Function1<V, R>, a: Property<V>): Property<R>;
export declare function combine<V, V2, R>(fn: Function2<V, V2, R>, a: Property<V>, b: Property<V2>): Property<R>;
export declare function combine<V, V2, V3, R>(fn: Function3<V, V2, V3, R>, a: Property<V>, b: Property<V2>, c: Property<V3>): Property<R>;
export declare function combine<V, V2, V3, V4, R>(fn: Function4<V, V2, V3, V4, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>): Property<R>;
export declare function combine<V, V2, V3, V4, V5, R>(fn: Function5<V, V2, V3, V4, V5, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>): Property<R>;
export declare function combine<V, V2, V3, V4, V5, V6, R>(fn: Function6<V, V2, V3, V4, V5, V6, R>, a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, f: Property<V6>): Property<R>;
export declare function combine<V, R>(fn: (...values: V[]) => R, Propertys: Property<any>[]): Property<R>;
export declare function combine<V, R>(a: PropertySeed<V>, fn: Function1<V, R>): PropertySeed<R>;
export declare function combine<V, V2, R>(a: PropertySeed<V>, b: PropertySeed<V2>, fn: Function2<V, V2, R>): PropertySeed<R>;
export declare function combine<V, V2, V3, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, fn: Function3<V, V2, V3, R>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, fn: Function4<V, V2, V3, V4, R>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, V5, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, fn: Function5<V, V2, V3, V4, V5, R>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, V5, V6, R>(a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, f: PropertySeed<V6>, fn: Function6<V, V2, V3, V4, V5, V6, R>): PropertySeed<R>;
export declare function combine<V, R>(properties: PropertySeed<V>[], fn: (...values: V[]) => R): PropertySeed<R>;
export declare function combine<V, R>(fn: Function1<V, R>, a: PropertySeed<V>): PropertySeed<R>;
export declare function combine<V, V2, R>(fn: Function2<V, V2, R>, a: PropertySeed<V>, b: PropertySeed<V2>): PropertySeed<R>;
export declare function combine<V, V2, V3, R>(fn: Function3<V, V2, V3, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, R>(fn: Function4<V, V2, V3, V4, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, V5, R>(fn: Function5<V, V2, V3, V4, V5, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>): PropertySeed<R>;
export declare function combine<V, V2, V3, V4, V5, V6, R>(fn: Function6<V, V2, V3, V4, V5, V6, R>, a: PropertySeed<V>, b: PropertySeed<V2>, c: PropertySeed<V3>, d: PropertySeed<V4>, e: PropertySeed<V5>, f: PropertySeed<V6>): PropertySeed<R>;
export declare function combine<V, R>(fn: (...values: V[]) => R, Propertys: PropertySeed<any>[]): PropertySeed<R>;
