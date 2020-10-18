import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
export declare type Predicate<A> = (value: A) => boolean;
export declare function filter<A>(fn: Predicate<A>): GenericTransformOp;
export declare function filter<A>(fn: Predicate<A>, scope: Scope): GenericTransformOpScoped;
