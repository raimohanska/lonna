
import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { flatMapLatest } from "./flatmaplatest";
import { later } from "./later";
import { Scope } from "./scope";
import { transformChanges } from "./transformchanges";

export function debounce<A>(prop: Atom<A> | AtomSeed<A>, delay: number): AtomSeed<A>;
export function debounce<A>(prop: Atom<A> | AtomSeed<A>, delay: number, scope: Scope): Atom<A>;
export function debounce<A>(prop: Property<A> | PropertySeed<A>, delay: number): PropertySeed<A>;
export function debounce<A>(prop: Property<A> | PropertySeed<A>, delay: number, scope: Scope): Property<A>;
export function debounce<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number): EventStreamSeed<A>;
export function debounce<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number, scope: Scope): EventStream<A>;

export function debounce<A>(s: any, delay: number, scope?: Scope): any {
    return applyScopeMaybe(transformChanges(s + `.debounce(${delay})`, s, changes => flatMapLatest(changes, value => later(delay, value))), scope)
}