
import { Scope } from "./abstractions";
import { flatMapLatest } from "./flatmaplatest";
import { later } from "./later";
import { GenericTransformOp, GenericTransformOpScoped } from "./transform";
import { transformChanges } from "./transformchanges";


export function debounce<A>(delay: number): GenericTransformOp
export function debounce<A>(delay: number, scope: Scope): GenericTransformOpScoped
export function debounce<A>(delay: number, scope?: Scope): any {
    return transformChanges(`debounce(${delay})`, changes => flatMapLatest(value => later(delay, value))(changes), scope as any)
}