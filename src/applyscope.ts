import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { StatefulDependentAtom } from "./atom";
import { SeedToStream } from "./eventstream";
import { StatefulProperty } from "./property";
import { Scope } from "./scope";
import { GenericTransformOpScoped } from "./transform";

export function applyScope(scope: Scope): GenericTransformOpScoped {
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
export function applyScopeMaybe<A>(seed: any, scope: Scope | undefined): any {
    if (scope !== undefined) {
        return applyScope(scope)(seed)
    }
    return seed
}