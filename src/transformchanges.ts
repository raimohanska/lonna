import { EventStreamSeed, isAtomSeed, isEventStreamSeed, isPropertySeed, PropertySeed, Scope } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { changes } from "./changes"
import { AtomSeedImpl, PropertySeedImpl } from "./implementations"
import { UnaryTransformOp, UnaryTransformOpScoped } from "./transform"
import { rename } from "./util"


export type EventStreamDelay<V> = (stream: EventStreamSeed<V>) => EventStreamSeed<V>

export function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>): UnaryTransformOp<A>
export function transformChanges<A>(descSuffix: string, transformer: EventStreamDelay<A>, scope: Scope): UnaryTransformOpScoped<A>

export function transformChanges<A, B>(descSuffix: string, transformer: EventStreamDelay<A>, scope?: Scope): any {
    return (x: any) => {
        const desc = `${x}.${descSuffix}`
        let r;
        if (isEventStreamSeed<A>(x)) {
            r = rename(desc, transformer(x))
        } else if (isAtomSeed<A>(x)) {
            const source = x.consume()
            r = new AtomSeedImpl(desc, () => source.get(), observer => {
                return transformer(changes(source)).consume().subscribe(observer)
            }, source.set)
        } else if (isPropertySeed<A>(x)) {
            const source = x.consume()
            r = new PropertySeedImpl(desc, () => source.get(), observer => {
                return transformer(changes(source)).consume().subscribe(observer)
            })
        } else {
            throw Error("Unknown observable " + x)
        }
        return applyScopeMaybe(r, scope)
    }
}