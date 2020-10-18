import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, Observable, Observer, Property, PropertySeed, PropertySubscribe, Subscribe } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";

// TODO: continue

export type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;

export type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
}

export interface GenericTransformOp {
    <A>(prop: Atom<A> | AtomSeed<A>): AtomSeed<A>;
    <A>(prop: Property<A> | PropertySeed<A>): PropertySeed<A>;
    <A>(s: EventStream<A> | EventStreamSeed<A>): EventStreamSeed<A>;    
}

export interface GenericTransformOpScoped {
    <A>(prop: Atom<A> | AtomSeed<A>): Atom<A>;
    <A>(prop: Property<A> | PropertySeed<A>): Property<A>;
    <A>(s: EventStream<A> | EventStreamSeed<A>): EventStream<A>;
}

export interface BinaryTransformOp<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>
    (seed: PropertySeed<A> | Property<A>): PropertySeed<B>
    (o: Observable<A>): Observable<B> // A generic signature. Note that the implementation is defined for the above cases only.    
}

export interface BinaryTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>
    (seed: PropertySeed<A> | Property<A>): Property<B>    
}

export interface StreamTransformOp<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>
}

export interface StreamTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>
}

export interface UnaryTransformOp<A> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<A>
    (seed: PropertySeed<A> | Property<A>): PropertySeed<A>
    (seed: AtomSeed<A> | Atom<A>): AtomSeed<A>
    (o: Observable<A>): Observable<A> // A generic signature. Note that the implementation is defined for the above cases only.    
}

export interface UnaryTransformOpScoped<A> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<A>
    (seed: PropertySeed<A> | Property<A>): Property<A>
    (seed: AtomSeed<A> | Atom<A>): Atom<A>
}

export function transform<A>(desc: string, transformer: Transformer<A, A>): UnaryTransformOp<A>
export function transform<A>(desc: string, transformer: Transformer<A, A>, scope: Scope): UnaryTransformOpScoped<A>
export function transform<A, B>(desc: string, transformer: Transformer<A, B>): BinaryTransformOp<A, B>
export function transform<A, B>(desc: string, transformer: Transformer<A, B>, scope: Scope): BinaryTransformOpScoped<A, B>
export function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>): StreamTransformOp<A, B>
export function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>, scope: Scope): StreamTransformOpScoped<A, B>

export function transform<A, B>(desc: string, transformer: Transformer<A, B> | StreamTransformer<A, B>, scope?: Scope): any {    
    return (x: any) => {
        if (x instanceof EventStream || x instanceof EventStreamSeed) {
            let transformFn = (transformer instanceof Function) ? transformer : transformer.changes
            const source = x.consume()
            return applyScopeMaybe(new EventStreamSeed(desc, observer => source.subscribe((value: Event<A>) => transformFn(value, observer))))    
        } 
    
        const t = transformer as Transformer<A, B>        
        if (x instanceof Atom || x instanceof AtomSeed) {
            const source = x.consume()
            return applyScopeMaybe(new AtomSeed(desc, () => t.init(source.get()), transformPropertySubscribe(source, t), newValue => source.set(newValue)))
        } else if (x instanceof Property || x instanceof PropertySeed) {
            const source = x.consume()
            return applyScopeMaybe(new PropertySeed(desc, () => t.init(source.get()), transformPropertySubscribe(source, t)))
        } else {
            throw Error("Unknown observable " + x)
        }    
    }
}

function transformPropertySubscribe<A, B>(src: { onChange: Subscribe<A> }, transformer: Transformer<A, B>): Subscribe<B> {
    if (src === undefined) throw Error("Assertion failed")
    return (observer: Observer<Event<B>>) => src.onChange(value => transformer.changes(value, observer))
}
