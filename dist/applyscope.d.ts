import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export interface ApplyScopeFn {
    <T>(stream: Atom<T>): Atom<T>;
    <T>(stream: Property<T>): Property<T>;
    <T>(stream: EventStream<T>): EventStream<T>;
    <T>(stream: AtomSeed<T>): Atom<T>;
    <T>(stream: PropertySeed<T>): Property<T>;
    <T>(stream: EventStreamSeed<T>): EventStream<T>;
}
export declare function applyScope(scope: Scope): ApplyScopeFn;
/** @hidden */
export declare function applyScopeMaybe<A>(seed: any, scope?: Scope): any;
