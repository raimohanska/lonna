import { EventStream, EventStreamSeed, Observable, Property, PropertySeed } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { FlatMapStreamSeed, FlatMapPropertySeed, Spawner } from "./flatmap";
import { Scope } from "./scope";

export function flatMapLatest<A, B>(s: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>): PropertySeed<B>;
export function flatMapLatest<A, B>(s: Property<A> | PropertySeed<A>, fn: Spawner<A, PropertySeed<B> | Property<B>>, scope: Scope): Property<B>;
export function flatMapLatest<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, Observable<B>>): EventStreamSeed<B>;
export function flatMapLatest<A, B>(s: EventStream<A> | EventStreamSeed<A>, fn: Spawner<A, Observable<B>>, scope: Scope): EventStream<B>;

export function flatMapLatest<A, B extends Observable<any>>(s: Observable<A>, fn: Spawner<A, any>, scope?: Scope): any {
    if (s instanceof Property || s instanceof PropertySeed) {
        return applyScopeMaybe(new FlatMapPropertySeed(`${s}.flatMapLatest(fn)`, s, fn, { latest: true }), scope)
    } else {
        return applyScopeMaybe(new FlatMapStreamSeed(`${s}.flatMapLatest(fn)`, s, fn, { latest: true }), scope)
    }
}