import { EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions"
import { Scope } from "./scope"
import { merge } from "./merge"
import { scan } from "./scan"
import { map } from "./map"
import { applyScopeMaybe } from "./applyscope"
import { toString } from "./tostring"
import { rename } from "./util"

export type UpdateTrigger<T> = EventStream<T> | EventStreamSeed<T>
export type UpdateParam<T> = UpdateTrigger<T> | Property<T>

/**
 *  [Update](#update) pattern consisting of a single EventStream and a accumulator function.
 */
export type UpdatePattern1<I1,O> = [UpdateTrigger<I1>, O | ((acc: O, a: I1) => O)]
/**
 *  [Update](#update) pattern consisting of 2 Observables and an accumulrator function.
 */
export type UpdatePattern2<I1,I2,O> = [UpdateTrigger<I1>, Property<I1>, O | ((acc: O, a: I1, b: I2) => O)]
/**
 *  [Update](#update) pattern consisting of 3 Observables and an accumulrator function.
 */
export type UpdatePattern3<I1,I2,I3,O> = [UpdateTrigger<I1>, Property<I1>, Property<I3>, O | ((acc: O, a: I1, b: I2, c: I3) => O)]
/**
 *  [Update](#update) pattern consisting of 4 Observables and an accumulrator function.
 */
export type UpdatePattern4<I1,I2,I3,I4,O> = [UpdateTrigger<I1>, Property<I1>, Property<I3>, Property<I4>, O | ((acc: O, a: I1, b: I2, c: I3, d: I4) => O)]
/**
 *  [Update](#update) pattern consisting of 5 Observables and an accumulrator function.
 */
export type UpdatePattern5<I1,I2,I3,I4,I5,O> = [UpdateTrigger<I1>, Property<I1>, Property<I3>, Property<I4>, Property<I5>, O | ((acc: O, a: I1, b: I2, c: I3, d: I4, e: I5) => O)]
/**
 *  [Update](#update) pattern consisting of 6 Observables and an accumulrator function.
 */
export type UpdatePattern6<I1,I2,I3,I4,I5,I6,O> = [UpdateTrigger<I1>, Property<I1>, Property<I3>, Property<I4>, Property<I5>, Property<I6>, O | ((acc: O, a: I1, b: I2, c: I3, d: I4, e: I5, f: I6) => O)]

/**
 *  [Update](#update) pattern type, allowing up to 6 sources per pattern.
 */
export type UpdatePattern<O> =
  UpdatePattern1<any, O> |
  UpdatePattern2<any, any, O> |
  UpdatePattern3<any, any, any, O> |
  UpdatePattern4<any, any, any, any, O> |
  UpdatePattern5<any, any, any, any, any, O> |
  UpdatePattern6<any, any, any, any, any, any, O>

/**
 Creates a Property from an initial value and updates the value based on multiple inputs.
 The inputs are defined similarly to [`Bacon.when`](#bacon-when), like this:

 ```js
 var result = Bacon.update(
 initial,
 [x,y,z, (previous,x,y,z) => { ... }],
 [x,y,   (previous,x,y) => { ... }])
 ```

 As input, each function above will get the previous value of the `result` Property, along with values from the listed Observables.
 The value returned by the function will be used as the next value of `result`.

 Just like in [`Bacon.when`](#when), only EventStreams will trigger an update, while Properties will be just sampled.
 So, if you list a single EventStream and several Properties, the value will be updated only when an event occurs in the EventStream.

 Here's a simple gaming example:

 ```js
 let scoreMultiplier = Bacon.constant(1)
 let hitUfo = Bacon.interval(1000)
 let hitMotherShip = Bacon.later(10000)
 let score = Bacon.update(
 0,
 [hitUfo, scoreMultiplier, (score, _, multiplier) => score + 100 * multiplier ],
 [hitMotherShip, (score, _) => score + 2000 ]
 )
 ```

 In the example, the `score` property is updated when either `hitUfo` or `hitMotherShip` occur. The `scoreMultiplier` Property is sampled to take multiplier into account when `hitUfo` occurs.

 * @param initial
 * @param {UpdatePattern<Out>} patterns
 * @returns {Property<Out>}
 */
export function update<Out>(initial: Out, ...patterns: UpdatePattern<Out>[]): PropertySeed<Out>;
export function update<Out>(scope: Scope, initial: Out, ...patterns: UpdatePattern<Out>[]): Property<Out>;

export function update<Out>(...args: any[]): any {
    let scope: Scope | undefined;
    let initial: Out;
    let patterns: UpdatePattern<Out>[];
    if (args[0] instanceof Scope) {
        scope = args[0]
        initial = args[1]
        patterns = args.slice(2)
        console.log("Scoped", initial, patterns)
    } else {
        scope = undefined;
        initial = args[0]
        patterns = args.slice(1)
    }
    
    let mutators: EventStreamSeed<Mutation<Out>>[] = patterns.map(pattern => {
        if (pattern.length < 2) throw Error(`Illegal pattern ${pattern}, length must be >= 2`)
        let sources: UpdateParam<Out>[] = pattern.slice(0, pattern.length - 1) as any
        const trigger = sources[0]
        if (!(trigger instanceof EventStream || trigger instanceof EventStreamSeed)) throw Error(`Illegal pattern ${pattern}, must contain one EventStream`)
        const properties = sources.slice(1) as Property<any>[]
        for (let prop of properties) {
            if (!(prop instanceof Property)) throw Error(`Illegal pattern ${pattern}. After one EventStream the rest on the observables must be Properties`)
        }
        let combinator = pattern[pattern.length - 1] as (...args: any) => Out
        if (!(combinator instanceof Function)) {
            const constantValue = combinator
            combinator = () => constantValue
        }
        return map(trigger as EventStreamSeed<any>, (v1 => {
            return (state: Out) => {
                const propValues = properties.map(p => p.get())
                return combinator(state, v1, ...propValues)
            }
        }))
    })

    return rename(`update(${toString(initial)},${toString(patterns)})`, applyScopeMaybe(scan<Mutation<Out>, Out>(merge(mutators), initial, (state, mutation) => mutation(state)), scope))
}

type Mutation<V> = (prev: V) => V