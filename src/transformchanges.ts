import { Atom, AtomSeed, EventStream, EventStreamSeed, Property, PropertySeed } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { changes } from "./changes"
import { Scope } from "./scope"
import { UnaryTransformOp, UnaryTransformOpScoped } from "./transform"
import { rename } from "./util"

export type EventStreamDelay<V> = (stream: EventStreamSeed<V>) => EventStreamSeed<V>

export function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>): UnaryTransformOp<A>
export function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>, scope: Scope): UnaryTransformOpScoped<A>

export function transformChanges<A, B>(descSuffix: string, transformer: EventStreamDelay<A>, scope?: Scope): any {
    return (x: any) => {
        const desc = `${x}.${descSuffix}`
        let r;
        if (x instanceof EventStream || x instanceof EventStreamSeed) {
            r = rename(desc, transformer(x as EventStreamSeed<A>)) // TODO: stream coerced into stream seed due to improper typing
        } else if (x instanceof Atom || x instanceof AtomSeed) {
            const source = x instanceof Property ? x : x.consume()
            r = new AtomSeed(desc, () => source.get(), observer => {
                return transformer(changes(source as any as AtomSeed<A>)).consume().subscribe(observer) // TODO: AtomSource coerced into AtomSeed due to improper typing
            }, source.set)
        } else if (x instanceof Property || x instanceof PropertySeed) {
            const source = x instanceof Property ? x : x.consume()
            r = new PropertySeed(desc, () => source.get(), observer => {
                return transformer(changes(source as any as PropertySeed<A>)).consume().subscribe(observer) // TODO: PropertySource coerced into PropertySeed due to improper typing
            })
        } else {
            throw Error("Unknown observable " + x)
        }
        return applyScopeMaybe(r, scope)
    }
}