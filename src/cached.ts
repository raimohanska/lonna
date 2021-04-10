import { Scope } from "./abstractions";
import { IdentityTransformer, transform, UnaryTransformOp, UnaryTransformOpScoped } from "./transform";

export function cached<A>(scope: Scope): UnaryTransformOpScoped<A>
export function cached<A>(): UnaryTransformOp<A>

export function cached(f?: Scope): any {
    // cache for observables
    return transform(["cached", []], IdentityTransformer, f as Scope)
}