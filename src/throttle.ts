import { Event, Atom, AtomSeed, EventStream, EventStreamSeed, Observer, Property, PropertySeed, isValue } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { map } from "./map";
import { Scope } from "./scope";
import { transform, Transformer } from "./transform";
import { transformChanges } from "./transformchanges";
import { bufferWithTime } from "./buffer";

// TODO PropertySeed not suitable here yet (need separate subscribe+get)
//export function throttle<A>(prop: Atom<A> | AtomSeed<A>, delay: number): AtomSeed<A>;
//export function throttle<A>(prop: Atom<A> | AtomSeed<A>, delay: number, scope: Scope): Atom<A>;
export function throttle<A>(prop: Property<A> | PropertySeed<A>, delay: number): PropertySeed<A>;
export function throttle<A>(prop: Property<A> | PropertySeed<A>, delay: number, scope: Scope): Property<A>;
export function throttle<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number): EventStreamSeed<A>;
export function throttle<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number, scope: Scope): EventStream<A>;

export function throttle<A>(s: any, delay: number, scope?: Scope): any {
    return transformChanges(s + `.throttle(${delay})`, s, changes => map(bufferWithTime(changes, delay), values => values[values.length - 1]))
}
