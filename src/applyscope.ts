import { ObservableSeed, Scope } from "./abstractions";
import { GenericTransformOpScoped } from "./transform";

export function applyScope(scope: Scope): GenericTransformOpScoped {
    return ((seed: ObservableSeed<any, any, any>) => {
        return seed.applyScope(scope)
    }) as any
}

/** @hidden */
export function applyScopeMaybe<A>(seed: any, scope: Scope | undefined): any {
    if (scope !== undefined) {
        return applyScope(scope)(seed)
    }
    return seed
}