import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
export declare function debounce<A>(delay: number): GenericTransformOp;
export declare function debounce<A>(delay: number, scope: Scope): GenericTransformOpScoped;
