import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { StatefulDependentAtom } from "./atom";
import { SeedToStream } from "./eventstream";
import { StatefulProperty } from "./property";
import { Scope } from "./scope";

export function applyScope<T>(scope: Scope, stream: EventStreamSeed<T>): EventStream<T>;
export function applyScope<T>(scope: Scope, stream: AtomSeed<T>): Atom<T>;
export function applyScope<T>(scope: Scope, stream: PropertySeed<T>): Property<T>;

export function applyScope<T>(scope: Scope, seed: any): any {
    if (seed instanceof EventStreamSeed) {        
        return new SeedToStream(seed, scope)
    } else if (seed instanceof AtomSeed) {
        return new StatefulDependentAtom(seed, scope)
    } else if (seed instanceof PropertySeed) {
        return new StatefulProperty(seed, scope)
    }
    throw Error("Unknown seed: " + seed)
}

/** @hidden */
export function applyScopeMaybe<A>(seed: any, scope?: Scope): any {
    if (scope !== undefined) {
        return applyScope(scope, seed)
    }
    return seed
}