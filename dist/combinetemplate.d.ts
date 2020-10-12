import { Property, PropertySeed, ObservableSeed } from "./abstractions";
import { Scope } from "./scope";
export declare type GenericObjectTemplate<T, O extends ObservableSeed<any, any>> = {
    [K in keyof T]: T[K] extends ObservableSeed<infer I, any> ? (T[K] extends O ? I : never) : (T[K] extends Record<any, any> ? GenericObjectTemplate<T[K], O> : (T[K] extends Array<infer I2> ? GenericArrayTemplate<I2, O> : T[K]));
};
export declare type GenericArrayTemplate<T, O extends ObservableSeed<any, any>> = Array<T extends ObservableSeed<infer I, any> ? (T extends O ? I : never) : (T extends Record<any, any> ? GenericObjectTemplate<T, O> : T)>;
export declare type GenericCombinedTemplate<T, O extends ObservableSeed<any, any>> = T extends Record<any, any> ? GenericObjectTemplate<T, O> : (T extends Array<infer I> ? GenericArrayTemplate<I, O> : (T extends ObservableSeed<infer I2, any> ? (T extends O ? I2 : never) : T));
export declare function combineTemplate<T>(template: T): Property<GenericObjectTemplate<T, Property<any>>>;
export declare function combineTemplateS<T>(template: T, scope: Scope): Property<GenericObjectTemplate<T, PropertySeed<any> | Property<any>>>;
export declare function combineTemplateS<T>(template: T): PropertySeed<GenericObjectTemplate<T, PropertySeed<any> | Property<any>>>;
export declare function each<A>(xs: any, f: (key: string, x: A) => any): void;
