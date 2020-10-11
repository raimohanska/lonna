import { Event, Atom, AtomSeed, EventStream, EventStreamSeed, Observer, Property, PropertySeed, isValue, endEvent } from "./abstractions";
import { applyScope, applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { transform, Transformer } from "./transform";

export type Predicate<A> = (value: A) => boolean

export function take<A>(count: number, prop: Atom<A> | AtomSeed<A>): AtomSeed<A>;
export function take<A>(count: number, prop: Atom<A> | AtomSeed<A>, scope: Scope): Atom<A>;
export function take<A>(count: number, prop: Property<A> | PropertySeed<A>): PropertySeed<A>;
export function take<A>(count: number, prop: Property<A> | PropertySeed<A>, scope: Scope): Property<A>;
export function take<A>(count: number, s: EventStream<A>): EventStream<A>;
export function take<A>(count: number, s: EventStreamSeed<A>): EventStreamSeed<A>;

export function take<A>(count: number, s: any, scope?: Scope): any {
    return applyScopeMaybe(transform(s + `.map(fn)`, s, takeT(count)), scope)
}

function takeT<A>(count: number): Transformer<A, A> {
    return {
        changes: (e: Event<A>, observer: Observer<Event<A>>) => {
            
            if (!isValue(e)) {
                observer(e);
            } else {
                count--;
                if (count > 0) {
                    observer(e);
                } else {
                    if (count === 0) { 
                        observer(e) 
                        observer(endEvent);
                    }               
                }
            }
        },
        init: (value: A) => {
            return value
        }
    }
}