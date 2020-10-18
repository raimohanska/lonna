import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, Observable, Observer, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;
export declare type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
};
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
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>;
    (seed: PropertySeed<A> | Property<A>): PropertySeed<B>;
    (o: Observable<A>): Observable<B>;
}
export interface BinaryTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>;
    (seed: PropertySeed<A> | Property<A>): Property<B>;
}
export interface StreamTransformOp<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<B>;
}
export interface StreamTransformOpScoped<A, B> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<B>;
}
export interface UnaryTransformOp<A> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStreamSeed<A>;
    (seed: PropertySeed<A> | Property<A>): PropertySeed<A>;
    (seed: AtomSeed<A> | Atom<A>): AtomSeed<A>;
    (o: Observable<A>): Observable<A>;
}
export interface UnaryTransformOpScoped<A> {
    (seed: EventStreamSeed<A> | EventStream<A>): EventStream<A>;
    (seed: PropertySeed<A> | Property<A>): Property<A>;
    (seed: AtomSeed<A> | Atom<A>): Atom<A>;
}
export declare function transform<A>(desc: string, transformer: Transformer<A, A>): UnaryTransformOp<A>;
export declare function transform<A>(desc: string, transformer: Transformer<A, A>, scope: Scope): UnaryTransformOpScoped<A>;
export declare function transform<A, B>(desc: string, transformer: Transformer<A, B>): BinaryTransformOp<A, B>;
export declare function transform<A, B>(desc: string, transformer: Transformer<A, B>, scope: Scope): BinaryTransformOpScoped<A, B>;
export declare function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>): StreamTransformOp<A, B>;
export declare function transform<A, B>(desc: string, transformer: StreamTransformer<A, B>, scope: Scope): StreamTransformOpScoped<A, B>;
