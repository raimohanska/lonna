import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { StatefulDependentAtom } from "./atom";
import { SeedToStream } from "./eventstream";
import { constant, StatefulProperty } from "./property";
import { globalScope, Scope } from "./scope";

export interface ApplyScopeFn {
    <T>(stream: Atom<T>): Atom<T>;
    <T>(stream: Property<T>): Property<T>;
    <T>(stream: EventStream<T>): EventStream<T>;
    <T>(stream: AtomSeed<T>): Atom<T>;
    <T>(stream: PropertySeed<T>): Property<T>;
    <T>(stream: EventStreamSeed<T>): EventStream<T>;    
}

export function applyScope(scope: Scope): ApplyScopeFn {
    return ((seed: any) => {
        if (seed instanceof EventStreamSeed || seed instanceof EventStream) {        
            return new SeedToStream(seed, scope)
        } else if (seed instanceof AtomSeed || seed instanceof Atom) {
            return new StatefulDependentAtom(seed, scope)
        } else if (seed instanceof PropertySeed || seed instanceof Property) {
            return new StatefulProperty(seed, scope)
        }
        throw Error("Unknown seed: " + seed)
    }) as any
}

/** @hidden */
export function applyScopeMaybe<A>(seed: any, scope?: Scope): any {
    if (scope !== undefined) {
        return applyScope(scope)(seed)
    }
    return seed
}