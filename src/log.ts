import { EventStream, EventStreamSeed, ObservableSeed, Property, PropertySeed } from "./abstractions";
import { tap } from "./tap";

export type LogResult<O> = O extends Property<infer A> 
    ? Property<A>
    : O extends PropertySeed<infer A>
        ? PropertySeed<A>
        : O extends EventStream<infer A>
            ? EventStream<A>
            : O extends EventStreamSeed<infer A>
                ? EventStreamSeed<A>
                : never

export interface LogOp {
    <O extends ObservableSeed<any, any>>(o: O): LogResult<O>
}
export function log(...prefixes: any[]): LogOp {
    return tap((x: any) => console.log(...prefixes, x)) as LogOp
}