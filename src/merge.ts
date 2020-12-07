import { endEvent, EventStream, EventStreamSeed, isEventStream, isValue } from "./abstractions";
import { applyScope } from "./applyscope";
import { EventStreamSeedImpl } from "./eventstream";
import { nop } from "./util";

export function merge<A>(a: EventStream<A>, b: EventStream<A>): EventStream<A>;
export function merge<A, B>(a: EventStream<A>, b: EventStream<B>): EventStream<A | B>;
export function merge<A, B, C>(a: EventStream<A>, b: EventStream<B>, c: EventStream<C>): EventStream<A | B | C>;
export function merge<A, B, C, D>(a: EventStream<A>, b: EventStream<B>, c: EventStream<C>, d: EventStream<D>): EventStream<A | B | C | D>;
export function merge<A, B, C, D, E>(a: EventStream<A>, b: EventStream<B>, c: EventStream<C>, d: EventStream<D>, e: EventStream<E>): EventStream<A | B | C | D | E>;
export function merge<A>(a: EventStreamSeed<A>, b: EventStreamSeed<A>): EventStreamSeed<A>;
export function merge<A, B>(a: EventStreamSeed<A>, b: EventStreamSeed<B>): EventStreamSeed<A | B>;
export function merge<A, B, C>(a: EventStreamSeed<A>, b: EventStreamSeed<B>, c: EventStreamSeed<C>): EventStreamSeed<A | B | C>;
export function merge<A, B, C, D>(a: EventStreamSeed<A>, b: EventStreamSeed<B>, c: EventStreamSeed<C>, d: EventStreamSeed<D>): EventStreamSeed<A | B | C | D>;
export function merge<A, B, C, D, E>(a: EventStreamSeed<A>, b: EventStreamSeed<B>, c: EventStreamSeed<C>, d: EventStreamSeed<D>, e: EventStreamSeed<E>): EventStreamSeed<A | B | C | D | E>;
export function merge<A>(streams: EventStreamSeed<A>[]): EventStreamSeed<A>
export function merge<A>(streams: EventStream<A>[]): EventStream<A>
export function merge<A>(...args: any[]) {
    let streams: (EventStream<any> | EventStreamSeed<any>)[]
    if (args[0] instanceof Array) {
        streams = args[0]
    } else {
        streams = args
    }

    const sources = streams.map(s => s.consume())
    const seed = new EventStreamSeedImpl<A>(`merge(${streams})`, (onValue, onEnd = nop) => {
        let endCount = 0
        const unsubs = sources.map(s => s.subscribe(event => {
            onValue(event)
        }, () => {
            endCount++
            if (endCount === sources.length) {
                onEnd()
            }
        }))
        return () => unsubs.forEach(f => f())
    })
    if (sources.every(isEventStream)) {
        return applyScope(sources[0].getScope())(seed)
    }
    return seed
}