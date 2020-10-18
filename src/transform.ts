import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, Observable, ObservableSeed, Observer, Property, PropertySeed, PropertySubscribe, Subscribe } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { Scope } from "./scope";

export type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;

export type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
}

// TODO: go through the rest of the newly piped operators and remove multimethods to get piped inference right (verify in tests)
// TODO: remove scoped versions, use applyScope in pipe instead

export type StatefulTransformResult<B, O> = O extends Property<any>            
    ? PropertySeed<B>
    : O extends PropertySeed<any>
        ? PropertySeed<B>
        : O extends EventStream<any>
            ? EventStreamSeed<B>
            : O extends EventStreamSeed<any>
                ? EventStreamSeed<B>
                : never

export type StatefulScopedTransformResult<B, O> = O extends Property<any>            
    ? Property<B>
    : O extends PropertySeed<any>
        ? Property<B>
        : O extends EventStream<any>
            ? EventStream<B>
            : O extends EventStreamSeed<any>
                ? EventStream<B>
                : never    

// TODO: by using type branding, we can find a common type for Property<A> and PropertySeed<A> and simplify these types

export type StatefulUnaryTransformResult<B, O> = O extends Atom<any>
    ? AtomSeed<B>
    : O extends AtomSeed<any>
        ? AtomSeed<B>
        : O extends Property<any>            
            ? PropertySeed<B>
            : O extends PropertySeed<any>
                ? PropertySeed<B>
                : O extends EventStream<any>
                    ? EventStreamSeed<B>
                    : O extends EventStreamSeed<any>
                        ? EventStreamSeed<B>
                        : never

export type StatefulScopedUnaryTransformResult<B, O> = O extends Atom<any>
    ? Atom<B>
    : O extends AtomSeed<any>
        ? Atom<B>
        : O extends Property<any>            
            ? Property<B>
            : O extends PropertySeed<any>
                ? Property<B>
                : O extends EventStream<any>
                    ? EventStream<B>
                    : O extends EventStreamSeed<any>
                        ? EventStream<B>
                        : never      
        

export interface GenericTransformOp {
    <A, O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResult<A, O>;    
}

export interface GenericTransformOpScoped {
    <A, O extends ObservableSeed<A, any>>(o: O): StatefulScopedUnaryTransformResult<A, O>;
}

export interface BinaryTransformOp<A, B> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulTransformResult<B, O>;
}

export interface BinaryTransformOpScoped<A, B> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulScopedTransformResult<B, O>;
}

export interface StreamTransformOp<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>
}

export interface StreamTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>
}

export interface UnaryTransformOp<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResult<A, O>;  
}

export interface UnaryTransformOpScoped<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulScopedUnaryTransformResult<A, O>;  
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
