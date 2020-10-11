import { Atom, AtomSeed, Event, EventStream, EventStreamSeed, Observable, Observer, Property, PropertySeed } from "./abstractions";
import { Scope } from "./scope";
export declare type StreamTransformer<A, B> = (event: Event<A>, observer: Observer<Event<B>>) => void;
export declare type Transformer<A, B> = {
    changes: StreamTransformer<A, B>;
    init: (value: A) => B;
};
export declare function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>): EventStreamSeed<B>;
export declare function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: StreamTransformer<A, B>): EventStreamSeed<B>;
export declare function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>): PropertySeed<B>;
export declare function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: Transformer<A, B>, scope: Scope): EventStream<B>;
export declare function transform<A, B>(desc: string, seed: EventStreamSeed<A> | EventStream<A>, transformer: StreamTransformer<A, B>, scope: Scope): EventStream<B>;
export declare function transform<A, B>(desc: string, seed: PropertySeed<A> | Property<A>, transformer: Transformer<A, B>, scope: Scope): Property<B>;
export declare function transform<A>(desc: string, seed: AtomSeed<A> | Atom<A>, transformer: Transformer<A, A>): AtomSeed<A>;
export declare function transform<A, B>(desc: string, o: Observable<A>, transformer: Transformer<A, B>): Observable<B>;
