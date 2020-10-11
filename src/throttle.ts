import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { bufferWithTime } from "./buffer";
import { map } from "./map";
import { Scope } from "./scope";
import { transformChanges } from "./transformchanges";

export function throttle<A>(prop: Atom<A> | AtomSeed<A>, delay: number): AtomSeed<A>;
export function throttle<A>(prop: Atom<A> | AtomSeed<A>, delay: number, scope: Scope): Atom<A>;
export function throttle<A>(prop: Property<A> | PropertySeed<A>, delay: number): PropertySeed<A>;
export function throttle<A>(prop: Property<A> | PropertySeed<A>, delay: number, scope: Scope): Property<A>;
export function throttle<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number): EventStreamSeed<A>;
export function throttle<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number, scope: Scope): EventStream<A>;

export function throttle<A>(s: any, delay: number, scope?: Scope): any {
    return transformChanges(s + `.throttle(${delay})`, s, changes => map(bufferWithTime(changes, delay), values => values[values.length - 1]))
}
