import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, isAtomSeed, isEventStreamSeed, isPropertySeed, ObservableSeed, Observer, Property, PropertySeed, Scope, Subscribe } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { AtomSeedImpl, EventStreamSeedImpl, PropertySeedImpl } from "./implementations";

export type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;

export type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
}

export type StatefulTransformResult<B, O> = O extends PropertySeed<any>            
    ? PropertySeed<B>
    : O extends EventStreamSeed<any>
        ? EventStreamSeed<B>
        : never

export type StatefulTransformResultScoped<B, O> = O extends PropertySeed<any>            
    ? Property<B>
    : O extends EventStreamSeed<any>
        ? EventStream<B>
        : never    

export type StatefulUnaryTransformResult<O> = O extends AtomSeed<infer A>
    ? AtomSeed<A>
        : O extends PropertySeed<infer A>
            ? PropertySeed<A>
                : O extends EventStreamSeed<infer A>
                    ? EventStreamSeed<A>
                    : never

export type StatefulUnaryTransformResultScoped<O> = O extends AtomSeed<infer A>
    ? Atom<A>
        : O extends PropertySeed<infer A>
            ? Property<A>
                : O extends EventStreamSeed<infer A>
                    ? EventStream<A>
                    : never      
        

export interface GenericTransformOp {
    <A, O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResult<O>;    
}

export interface GenericTransformOpScoped {
    <A, O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResultScoped<O>;
}

export interface BinaryTransformOp<A, B> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulTransformResult<B, O>;
}

export interface BinaryTransformOpScoped<A, B> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulTransformResultScoped<B, O>;
}

export interface StreamTransformOp<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>
}

export interface StreamTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>
}

export interface UnaryTransformOp<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResult<O>;  
}

export interface UnaryTransformOpScoped<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResultScoped<O>;  
}

export function transform<A>(desc: string, transformer: Transformer<A, A>): UnaryTransformOp<A>
export function transform<A>(desc: string, transformer: Transformer<A, A>, scope: Scope): UnaryTransformOpScoped<A>
export function transform<A, B>(desc: string, transformer: Transformer<A, B>): BinaryTransformOp<A, B>
export function transform<A, B>(desc: string, transformer: Transformer<A, B>, scope: Scope): BinaryTransformOpScoped<A, B>
export function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>): StreamTransformOp<A, B>
export function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>, scope: Scope): StreamTransformOpScoped<A, B>

export function transform<A, B>(desc: string, transformer: Transformer<A, B> | StreamTransformer<A, B>, scope?: Scope): any {    
    return (x: any) => {
        if (isEventStreamSeed<A>(x)) {
            let transformFn = (transformer instanceof Function) ? transformer : transformer.changes
            const source = x.consume()
            return applyScopeMaybe(new EventStreamSeedImpl(desc, observer => source.subscribe((value: Event<A>) => transformFn(value, observer))), scope)    
        } 
        const t = transformer as Transformer<A, B>        
        if (isAtomSeed<A>(x)) {
            const source = x.consume()
            return applyScopeMaybe(new AtomSeedImpl(desc, () => t.init(source.get()), transformPropertySubscribe(source, t), newValue => source.set(newValue as any as A /* A and B are equal for atoms */)), scope)
        } else if (isPropertySeed<A>(x)) {
            const source = x.consume()
            return applyScopeMaybe(new PropertySeedImpl(desc, () => t.init(source.get()), transformPropertySubscribe(source, t)), scope)
        } else {
            throw Error("Unknown observable " + x)
        }    
    }
}

function transformPropertySubscribe<A, B>(src: { onChange: Subscribe<A> }, transformer: Transformer<A, B>): Subscribe<B> {
    if (src === undefined) throw Error("Assertion failed")
    return (observer: Observer<Event<B>>) => src.onChange(value => transformer.changes(value, observer))
}
