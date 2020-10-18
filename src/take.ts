import { endEvent, Event, isValue, Observer } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";
import { transform, Transformer, GenericTransformOp, GenericTransformOpScoped } from "./transform";

export function take<A>(count: number): GenericTransformOp
export function take<A>(count: number, scope: Scope): GenericTransformOpScoped
export function take<A>(count: number, scope?: Scope): any {
    return (s: any) => 
        applyScopeMaybe(transform(s + `.map(fn)`, takeT(count))(s), scope)
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