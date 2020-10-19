import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, ObservableSeed, Observer, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;
export declare type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
};
export declare type StatefulTransformResult<B, O> = O extends Property<any> ? PropertySeed<B> : O extends PropertySeed<any> ? PropertySeed<B> : O extends EventStream<any> ? EventStreamSeed<B> : O extends EventStreamSeed<any> ? EventStreamSeed<B> : never;
export declare type StatefulTransformResultScoped<B, O> = O extends Property<any> ? Property<B> : O extends PropertySeed<any> ? Property<B> : O extends EventStream<any> ? EventStream<B> : O extends EventStreamSeed<any> ? EventStream<B> : never;
export declare type StatefulUnaryTransformResult<O> = O extends Atom<infer A> ? AtomSeed<A> : O extends AtomSeed<infer A> ? AtomSeed<A> : O extends Property<infer A> ? PropertySeed<A> : O extends PropertySeed<infer A> ? PropertySeed<A> : O extends EventStream<infer A> ? EventStreamSeed<A> : O extends EventStreamSeed<infer A> ? EventStreamSeed<A> : never;
export declare type StatefulUnaryTransformResultScoped<O> = O extends Atom<infer A> ? Atom<A> : O extends AtomSeed<infer A> ? Atom<A> : O extends Property<infer A> ? Property<A> : O extends PropertySeed<infer A> ? Property<A> : O extends EventStream<infer A> ? EventStream<A> : O extends EventStreamSeed<infer A> ? EventStream<A> : never;
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
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>;
}
export interface StreamTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>;
}
export interface UnaryTransformOp<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResult<O>;
}
export interface UnaryTransformOpScoped<A> {
    <O extends ObservableSeed<A, any>>(o: O): StatefulUnaryTransformResultScoped<O>;
}
export declare function transform<A>(desc: string, transformer: Transformer<A, A>): UnaryTransformOp<A>;
export declare function transform<A>(desc: string, transformer: Transformer<A, A>, scope: Scope): UnaryTransformOpScoped<A>;
export declare function transform<A, B>(desc: string, transformer: Transformer<A, B>): BinaryTransformOp<A, B>;
export declare function transform<A, B>(desc: string, transformer: Transformer<A, B>, scope: Scope): BinaryTransformOpScoped<A, B>;
export declare function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>): StreamTransformOp<A, B>;
export declare function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>, scope: Scope): StreamTransformOpScoped<A, B>;
