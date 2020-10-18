import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
export declare function throttle<A>(delay: number): GenericTransformOp;
export declare function throttle<A>(delay: number, scope: Scope): GenericTransformOpScoped;
