import { endEvent, EventStream, EventStreamSeed, isValue } from "./abstractions";
import { applyScope } from "./applyscope";

export function merge<A>(a: EventStream<A>, b: EventStream<A>): EventStream<A>;
export function merge<A, B>(a: EventStream<A>, b: EventStream<B>): EventStream<A | B>;
export function merge<A>(a: EventStreamSeed<A>, b: EventStreamSeed<A>): EventStreamSeed<A>;
export function merge<A, B>(a: EventStreamSeed<A>, b: EventStreamSeed<B>): EventStreamSeed<A | B>;
export function merge<A>(streams: EventStreamSeed<A>[]): EventStreamSeed<A>
export function merge<A>(...args: any[]) {
    let streams: (EventStream<any> | EventStreamSeed<any>)[]
    if (args[0] instanceof Array) {
        streams = args[0]
    } else {
        streams = args
    }

    const sources = streams.map(s => s.consume())
    const seed = new EventStreamSeed<A>(`merge(${streams})`, observer => {
        let endCount = 0
        const unsubs = sources.map(s => s.subscribe(event => {
            if (isValue(event)) {
                observer(event)
            } else {
                endCount++
                if (endCount === sources.length) {
                    observer(endEvent)
                }
            }
        }))
        return () => unsubs.forEach(f => f())
    })
    if (sources[0] instanceof EventStream) {
        return applyScope(sources[0].getScope(), seed)
    }
    return seed
}