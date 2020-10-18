import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
export declare function take<A>(count: number): GenericTransformOp;
export declare function take<A>(count: number, scope: Scope): GenericTransformOpScoped;
