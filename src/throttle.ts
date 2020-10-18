import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { bufferWithTime } from "./buffer";
import { map } from "./map";
import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
import { transformChanges } from "./transformchanges";

export function throttle<A>(delay: number): GenericTransformOp
export function throttle<A>(delay: number, scope: Scope): GenericTransformOpScoped
export function throttle<A>(delay: number, scope?: Scope): any {
    return (s: any) => applyScopeMaybe(transformChanges(s + `.throttle(${delay})`, s, changes => map((values: any) => values[values.length - 1])(bufferWithTime(delay)(changes))), scope)
}
