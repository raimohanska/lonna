import { EventStream, EventStreamSeed, Observable, Property, PropertySeed } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { FlatMapStreamSeed, FlatMapPropertySeed, Spawner } from "./flatmap";
import { Scope } from "./scope";

export interface FlatMapLatestOp<A, B> {
    (s: Property<A> | PropertySeed<A>): PropertySeed<B>;
    (s: EventStream<A> | EventStreamSeed<A>): EventStreamSeed<B>;
}

export interface FlatMapLatestOpScoped<A, B> {
    (s: Property<A> | PropertySeed<A>): Property<B>;
    (s: EventStream<A> | EventStreamSeed<A>): EventStream<B>;
}

// TODO: typing is not perfect: spawners for properties should spawn property(seed)s, not streams

export function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>): FlatMapLatestOp<A, B>
export function flatMapLatest<A, B>(fn: Spawner<A, PropertySeed<B> | Property<B> | EventStream<B> | EventStreamSeed<B>>, scope: Scope): FlatMapLatestOpScoped<A, B>

export function flatMapLatest<A>(fn: Spawner<A, any>, scope?: Scope): any {
    return (s: any) => {
        if (s instanceof Property || s instanceof PropertySeed) {
            return applyScopeMaybe(new FlatMapPropertySeed(`${s}.flatMapLatest(fn)`, s, fn, { latest: true }), scope)
        } else {
            return applyScopeMaybe(new FlatMapStreamSeed(`${s}.flatMapLatest(fn)`, s, fn, { latest: true }), scope)
        }    
    }
}