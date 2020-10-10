import { Atom, AtomSeed, endEvent, EventStream, EventStreamSeed, isValue, Observer, Property, PropertySeed, Unsub } from "./abstractions";
import { applyScope, applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { transform, Transformer } from "./transform";
import { remove } from "./util";

export type Spawner<A, B> = (value: A) => (EventStreamSeed<B> | EventStream<B>)
export function flatMap<A, B>(s: EventStream<A>, fn: Spawner<A, B>): EventStream<B>;
export function flatMap<A, B>(s: EventStreamSeed<A>, fn: Spawner<A, B>, scope?: Scope): EventStreamSeed<B>;

export function flatMap<A, B>(s: EventStreamSeed<A> | EventStreamSeed<A>, fn: (value: A) => EventStreamSeed<B>, scope?: Scope): any {
    if (s instanceof EventStream) {
        scope = s.getScope()
    }
    return applyScopeMaybe(new EventStreamSeed<B>(`${s}.flatMap(fn)`, observer => {
        const children: Unsub[] = []
        let rootEnded = false
        const unsubThis = s.subscribe(event => {
            if (isValue(event)) {
                const child = fn(event.value)
                let ended = false
                const unsubChild = child.subscribe(event => {
                    if (isValue(event)) {
                        observer(event)
                    } else {
                        if (unsubChild) {
                            remove(children, unsubChild)
                        } else {
                            ended = true
                        }
                        if (children.length === 0 && rootEnded) {
                            observer(endEvent)
                        }
                    }
                })
                if (!ended) children.push(unsubChild)
            } else {
                rootEnded = true
                if (children.length === 0) {
                    observer(endEvent)
                }
            }
        })
        return () => {
            unsubThis()
            children.forEach(f => f())
        }
    }))
}