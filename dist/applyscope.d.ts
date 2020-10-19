import { Scope } from "./scope";
import { GenericTransformOpScoped } from "./transform";
export declare function applyScope(scope: Scope): GenericTransformOpScoped;
/** @hidden */
export declare function applyScopeMaybe<A>(seed: any, scope?: Scope): any;
