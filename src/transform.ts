import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, Observable, Observer, Property, PropertySeed, PropertySubscribe, Subscribe } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";

export type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;

export type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
}

export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>): EventStreamSeed<B>
export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: StreamTransformer<A, B>): EventStreamSeed<B>
export function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>): PropertySeed<B>
export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>, scope: Scope): EventStream<B>
export function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: StreamTransformer<A, B>, scope: Scope): EventStream<B>
export function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>, scope: Scope): Property<B>
export function transform<A>(desc: string, seed: AtomSeed<A> | Atom<A>, transformer: Transformer<A, A>): AtomSeed<A>
export function transform<A, B>(desc: string, o: Observable<A>, transformer: Transformer<A, B>): Observable<B> // A generic signature. Note that the implementation is defined for the above cases only.

export function transform<A, B>(desc: string, x: any, transformer: Transformer<A, B> | StreamTransformer<A, B>, scope?: Scope): any {    
    if (x instanceof EventStream || x instanceof EventStreamSeed) {
        if (transformer instanceof Function) {
            return applyScopeMaybe(new EventStreamSeed(desc, observer => x.subscribe((value: Event<A>) => transformer(value, observer))))    
        } else {
            return transform(desc, x as any, transformer.changes as any, scope as any)
        }        
    } 

    const t = transformer as Transformer<A, B>        
    if (x instanceof Atom || x instanceof AtomSeed) {
        return applyScopeMaybe(new AtomSeed(desc, () => t.init(x.get()), transformPropertySubscribe(x, t), newValue => x.set(newValue)))
    } else if (x instanceof Property || x instanceof PropertySeed) {
        return applyScopeMaybe(new PropertySeed(desc, () => t.init(x.get()), transformPropertySubscribe(x, t)))
    } else {
        throw Error("Unknown observable " + x)
    }
}

function transformPropertySubscribe<A, B>(src: { onChange: Subscribe<A> }, transformer: Transformer<A, B>): Subscribe<B> {
    if (src === undefined) throw Error("Assertion failed")
    return (observer: Observer<Event<B>>) => src.onChange(value => transformer.changes(value, observer))
}
