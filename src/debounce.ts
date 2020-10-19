
import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { flatMapLatest } from "./flatmaplatest";
import { later } from "./later";
import { Scope } from "./scope";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
import { transformChanges } from "./transformchanges";

export function debounce<A>(delay: number): GenericTransformOp
export function debounce<A>(delay: number, scope: Scope): GenericTransformOpScoped
export function debounce<A>(delay: number, scope?: Scope): any {
    return transformChanges(`debounce(${delay})`, changes => flatMapLatest(value => later(delay, value))(changes), scope as any)
}