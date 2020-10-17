import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare function applyScope<T>(scope: Scope, stream: EventStream<T>): EventStream<T>;
export declare function applyScope<T>(scope: Scope, stream: Property<T>): Property<T>;
export declare function applyScope<T>(scope: Scope, stream: Atom<T>): Atom<T>;
export declare function applyScope<T>(scope: Scope, stream: EventStreamSeed<T>): EventStream<T>;
export declare function applyScope<T>(scope: Scope, stream: AtomSeed<T>): Atom<T>;
export declare function applyScope<T>(scope: Scope, stream: PropertySeed<T>): Property<T>;
/** @hidden */
export declare function applyScopeMaybe<A>(seed: any, scope?: Scope): any;
