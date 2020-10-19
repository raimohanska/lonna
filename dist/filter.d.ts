import { Scope } from "./scope";
import { UnaryTransformOp, UnaryTransformOpScoped } from "./transform";
export declare type Predicate<A> = (value: A) => boolean;
export declare function filter<A>(fn: Predicate<A>): UnaryTransformOp<A>;
export declare function filter<A>(fn: Predicate<A>, scope: Scope): UnaryTransformOpScoped<A>;
