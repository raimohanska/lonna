import { EventStream, EventStreamSeed, isEventStream, isProperty, isPropertySeed, Observer, Property, PropertySeed, Scope, Subscribe } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { mapSubscribe } from "./map";
import { PropertySeedImpl, StatelessProperty } from "./property";
import { globalScope } from "./scope";

export interface ToStatelessPropertyOp<A> {
    (stream: EventStream<any> | Subscribe<any>): Property<A>
}
export function toStatelessProperty<A>(get: () => A): ToStatelessPropertyOp<A>
export function toStatelessProperty<A>(get: () => A) {
    return (streamOrSubscribe: any) => {
        if (isEventStream(streamOrSubscribe)) {        
            return new StatelessProperty(streamOrSubscribe.desc, get, mapSubscribe(streamOrSubscribe.subscribe.bind(streamOrSubscribe), get), streamOrSubscribe.getScope())
        } else {
            return new StatelessProperty(() => `toStatelessProperty(${streamOrSubscribe},${get}`, get, mapSubscribe(streamOrSubscribe, get), globalScope)
        }
    }
}

export interface ToPropertyOp<A> {
    <B>(stream: EventStream<B> | EventStreamSeed<B>): PropertySeed<A | B>;
}
export interface ToPropertyOpScoped<A> {
    <B>(stream: EventStream<B> | EventStreamSeed<B>): Property<A | B>;    
}

export function toProperty<A>(initial: A): ToPropertyOp<A>;
export function toProperty<A>(initial: A, scope: Scope): ToPropertyOpScoped<A>;
export function toProperty(initial: any, scope?: Scope) {    
    return (seed: EventStream<any> | EventStreamSeed<any>) => {
        const source = seed.consume()
        return applyScopeMaybe(new PropertySeedImpl(() => seed + `.toProperty(${initial})`, () => initial, (onValue, onEnd) => {        
            return source.subscribe(onValue, onEnd)
        }), scope)    
    }
}

export function toPropertySeed<A>(property: Property<A> | PropertySeed<A>): PropertySeed<A> {
    if (!isProperty(property)) {
        if (!isPropertySeed(property)) {
            throw Error("Assertion fail")
        }
        return property;
    }
    return new PropertySeedImpl<A>(property.desc, property.get.bind(property), property.onChange.bind(property))
}