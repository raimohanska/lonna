import { Property, Observable, PropertySeed } from "./abstractions";
export declare type GenericObjectTemplate<T, O extends Observable<any>> = {
    [K in keyof T]: T[K] extends Observable<infer I> ? (T[K] extends O ? I : never) : (T[K] extends Record<any, any> ? GenericObjectTemplate<T[K], O> : (T[K] extends Array<infer I2> ? GenericArrayTemplate<I2, O> : T[K]));
};
export declare type GenericArrayTemplate<T, O extends Observable<any>> = Array<T extends Observable<infer I> ? (T extends O ? I : never) : (T extends Record<any, any> ? GenericObjectTemplate<T, O> : T)>;
export declare type GenericCombinedTemplate<T, O extends Observable<any>> = T extends Record<any, any> ? GenericObjectTemplate<T, O> : (T extends Array<infer I> ? GenericArrayTemplate<I, O> : (T extends Observable<infer I2> ? (T extends O ? I2 : never) : T));
export declare function combineTemplate<T>(template: T): Property<GenericObjectTemplate<T, Property<any>>>;
export declare function combineTemplateS<T>(template: T): PropertySeed<GenericObjectTemplate<T, PropertySeed<any>>>;
export declare function each<A>(xs: any, f: (key: string, x: A) => any): void;
