import { ObservableSeed, Scope } from "./abstractions";
import { GenericTransformOpScoped } from "./transform";

// TODO: deprecated
export function applyScope(scope: Scope): GenericTransformOpScoped {
    return scope
}

/** @hidden */
export function applyScopeMaybe<A>(seed: any, scope: Scope | undefined): any {
    if (scope !== undefined) {
        return applyScope(scope)(seed)
    }
    return seed
}