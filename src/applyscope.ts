import { isAtomSeed, isEventStreamSeed, isPropertySeed, Scope } from "./abstractions";
import { StatefulDependentAtom } from "./atom";
import { SeedToStream } from "./eventstream";
import { StatefulProperty } from "./property";
import { GenericTransformOpScoped } from "./transform";

export function applyScope(scope: Scope): GenericTransformOpScoped {
    return ((seed: any) => {
        if (isEventStreamSeed(seed)) {        
            return new SeedToStream(seed, scope)
        } else if (isAtomSeed(seed)) {
            return new StatefulDependentAtom(seed, scope)
        } else if (isPropertySeed(seed)) {
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