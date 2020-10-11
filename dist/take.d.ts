import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare function take<A>(count: number, prop: Atom<A> | AtomSeed<A>): AtomSeed<A>;
export declare function take<A>(count: number, prop: Atom<A> | AtomSeed<A>, scope: Scope): Atom<A>;
export declare function take<A>(count: number, prop: Property<A> | PropertySeed<A>): PropertySeed<A>;
export declare function take<A>(count: number, prop: Property<A> | PropertySeed<A>, scope: Scope): Property<A>;
export declare function take<A>(count: number, s: EventStream<A>): EventStream<A>;
export declare function take<A>(count: number, s: EventStreamSeed<A>): EventStreamSeed<A>;
