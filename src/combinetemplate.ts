import { isObservableSeed, isProperty, isPropertySeed, ObservableSeed, Property, PropertySeed, Scope } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { combineAsArray, PropertyLike } from "./combine";
import { Predicate } from "./filter";
import { map } from "./map";
import { toPropertySeed } from "./toproperty";
import { constant } from "./constant";
import { rename } from "./util";

export type GenericObjectTemplate<T, O extends ObservableSeed<any, any>> = { [K in keyof T]: T[K] extends ObservableSeed<infer I, any>
    ? (T[K] extends O
        ? I
        : never)
    : (T[K] extends Record<any, any>
        ? GenericObjectTemplate<T[K], O>
        : (T[K] extends Array<infer I2>
            ? GenericArrayTemplate<I2, O>
            : T[K]))
}

export type GenericArrayTemplate<T, O extends ObservableSeed<any, any>> = Array<T extends ObservableSeed<infer I, any>
    ? (T extends O
        ? I
        : never)
    : (T extends Record<any, any>
        ? GenericObjectTemplate<T, O>
        : T)>

export type GenericCombinedTemplate<T, O extends ObservableSeed<any, any>> = T extends Record<any, any>
        ? GenericObjectTemplate<T, O>
        : (T extends Array<infer I>
            ? GenericArrayTemplate<I, O>
            : (T extends ObservableSeed<infer I2, any>
                ? (T extends O
                    ? I2
                    : never)
                : T))

/**
 Combines Properties, EventStreams and constant values using a template
 object. For instance, assuming you've got streams or properties named
 `password`, `username`, `firstname` and `lastname`, you can do

 ```js
 var password, username, firstname, lastname; // <- properties or streams
 var loginInfo = Bacon.combineTemplate({
    magicNumber: 3,
    userid: username,
    passwd: password,
    name: { first: firstname, last: lastname }})
 ```

 .. and your new loginInfo property will combine values from all these
 streams using that template, whenever any of the streams/properties
 get a new value. For instance, it could yield a value such as

 ```js
 { magicNumber: 3,
   userid: "juha",
   passwd: "easy",
   name : { first: "juha", last: "paananen" }}
 ```

 In addition to combining data from streams, you can include constant
 values in your templates.

 Note that all Bacon.combine* methods produce a Property instead of an EventStream.
 If you need the result as an [`EventStream`](classes/eventstream.html) you might want to use [`property.changes()`](classes/property.html#changes)

 ```js
 Bacon.combineWith(function(v1,v2) { .. }, stream1, stream2).changes()
 ```
 */
type Ctx = any

export function combineTemplate<T>(template: T): Property<GenericObjectTemplate<T, Property<any>>> {
    if (!containsObservables(template)) return constant(template) as any;
    const [observables, combinator] = processTemplate<T, Property<any>>(template, (x: ObservableSeed<any, any>) => {
        if (isProperty(x)) return x
        throw Error("Unsupported observable: " + x)
    })
    
    return rename("combineTemplate(..)", map(combinator as any)(combineAsArray(observables as Property<any>[])) as any) 
}

export function combineTemplateS<T>(template: T, scope: Scope): Property<GenericObjectTemplate<T, PropertySeed<any> | Property<any>>>;
export function combineTemplateS<T>(template: T): PropertySeed<GenericObjectTemplate<T, PropertySeed<any> | Property<any>>>;

export function combineTemplateS<T>(template: T, scope?: Scope): ObservableSeed<any, any>{
    if (!containsObservables(template)) return constant(template) as any;

    const [observables, combinator] = processTemplate<T, PropertySeed<any>>(template, (x: ObservableSeed<any, any>) => {
        if (isProperty(x)) return toPropertySeed(x)
        if (isPropertySeed(x)) return x
        throw Error("Unsupported observable: " + x)
    })
    const mapped = map(combinator as any)(combineAsArray(observables))
    return applyScopeMaybe(rename("combineTemplate(..)", mapped), scope)
}

function processTemplate<T, Prop>(template: T, mapObservable: (o: ObservableSeed<any, any>) => Prop): [Prop[], Function] {
    function current(ctxStack: Ctx[]) { return ctxStack[ctxStack.length - 1]; }
    function setValue(ctxStack: Ctx[], key: any, value: any) {
        (<any>current(ctxStack))[key] = value;
        return value;
    }
    function applyStreamValue(key: any, index: number) {
        return function (ctxStack: Ctx[], values: any[]) {
            setValue(ctxStack, key, values[index]);
        };
    }
    function constantValue(key: any, value: any) {
        return function (ctxStack: Ctx[]) {
            setValue(ctxStack, key, value);
        };
    }

    function mkContext(template: any): any {
        return template instanceof Array ? [] : {};
    }

    function pushContext(key: any, value: any) {
        return function (ctxStack: Ctx[]) {
            const newContext = mkContext(value);
            setValue(ctxStack, key, newContext);
            ctxStack.push(newContext);
        };
    }

    function compile(key: any, value: any) {
        if (isObservableSeed(value)) {
            if (isPropertySeed(value)) {
                observables.push(value);
                funcs.push(applyStreamValue(key, observables.length - 1));
            } else {
                throw Error("Unsupported Observable in combineTemplate: " + value)
            }
        } else if (containsObservables(value)) {
            const popContext = function (ctxStack: Ctx[]) { ctxStack.pop(); };
            funcs.push(pushContext(key, value));
            compileTemplate(value);
            funcs.push(popContext);
        } else {
            funcs.push(constantValue(key, value));
        }
    }

    function combinator(values: any[]): any {
        const rootContext = mkContext(template);
        const ctxStack = [rootContext];
        for (var i = 0, f; i < funcs.length; i++) {
            f = funcs[i];
            f(ctxStack, values);
        }
        return rootContext;
    }

    function compileTemplate(template: any) { each(template, compile); }

    const funcs: Function[] = [];
    const observables: PropertyLike<any>[] = [];
    
    compileTemplate(template)

    return [observables.map(mapObservable) as Prop[], combinator]
}

function containsObservables(value: any, match: Predicate<any> = isObservableSeed) {
    if (match(value)) {
        return true
    } else if (value && (value.constructor == Object || value.constructor == Array)) {
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                const child = value[key];
                if (containsObservables(child, match))
                    return true
            }
        }
    }
}

export function each<A>(xs: any, f: (key: string, x: A) => any) {
    for (var key in xs) {
        if (Object.prototype.hasOwnProperty.call(xs, key)) {
            var value = xs[key];
            f(key, value);
        }
    }
}