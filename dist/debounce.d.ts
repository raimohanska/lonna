import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare function debounce<A>(prop: Atom<A> | AtomSeed<A>, delay: number): AtomSeed<A>;
export declare function debounce<A>(prop: Atom<A> | AtomSeed<A>, delay: number, scope: Scope): Atom<A>;
export declare function debounce<A>(prop: Property<A> | PropertySeed<A>, delay: number): PropertySeed<A>;
export declare function debounce<A>(prop: Property<A> | PropertySeed<A>, delay: number, scope: Scope): Property<A>;
export declare function debounce<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number): EventStreamSeed<A>;
export declare function debounce<A>(s: EventStream<A> | EventStreamSeed<A>, delay: number, scope: Scope): EventStream<A>;
