import { composeDesc, Desc, EventStreamSeed, isAtomSeed, isEventStreamSeed, isPropertySeed, MethodDesc, PropertySeed, Scope } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { changes } from "./changes"
import { AtomSeedImpl } from "./atom"
import { PropertySeedImpl } from "./property"
import { UnaryTransformOp, UnaryTransformOpScoped } from "./transform"
import { rename } from "./util"


export type EventStreamDelay<V> = (stream: EventStreamSeed<V>) => EventStreamSeed<V>

export function transformChanges<A>(methodCallDesc: MethodDesc, transformer: EventStreamDelay<A>): UnaryTransformOp<A>
export function transformChanges<A>(methodCallDesc: MethodDesc, transformer: EventStreamDelay<A>, scope: Scope): UnaryTransformOpScoped<A>

export function transformChanges<A, B>(methodCallDesc: MethodDesc, transformer: EventStreamDelay<A>, scope?: Scope): any {
    return (x: any) => {
        const desc = composeDesc(x, methodCallDesc)
        let r;
        if (isEventStreamSeed<A>(x)) {
            r = rename(desc, transformer(x))
        } else if (isAtomSeed<A>(x)) {
            const source = x.consume()
            r = new AtomSeedImpl(desc, () => source.get(), (onValue, onEnd) => {
                return transformer(changes(source)).consume().subscribe(onValue, onEnd)
            }, source.set)
        } else if (isPropertySeed<A>(x)) {
            const source = x.consume()
            r = new PropertySeedImpl(desc, () => source.get(), (onValue, onEnd) => {
                return transformer(changes(source)).consume().subscribe(onValue, onEnd)
            })
        } else {
            throw Error("Unknown observable " + x)
        }
        return applyScopeMaybe(r, scope)
    }
}