import { Atom, EventStream, EventStreamSeed, ObservableSeed, Property, PropertySeed } from "./abstractions";
import { LensedAtom } from "./atom";
import * as L from "./lens";
import { map } from "./map";
import { rename, toString } from "./util";

export function view<A, K extends keyof A>(a: Atom<A>, key: K): K extends number ? Atom<A[K] | undefined> : Atom<A[K]>;
export function view<A, B>(a: Atom<A>, lens: L.Lens<A, B>): Atom<B>;
export function view<A, K extends keyof A>(a: Property<A>, key: K): K extends number ? Atom<A[K] | undefined> : Property<A[K]>;
export function view<A, B>(a: Property<A>, lens: L.Lens<A, B>): Property<B>;
export function view<A, K extends keyof A>(a: EventStream<A>, key: K): K extends number ? Atom<A[K] | undefined> : EventStream<A[K]>;
export function view<A, B>(a: EventStream<A>, lens: L.Lens<A, B>): EventStream<B>;
export function view<A, K extends keyof A>(a: PropertySeed<A>, key: K): K extends number ? Atom<A[K] | undefined> : PropertySeed<A[K]>;
export function view<A, B>(a: PropertySeed<A>, lens: L.Lens<A, B>): PropertySeed<B>;
export function view<A, K extends keyof A>(a: EventStreamSeed<A>, key: K): K extends number ? Atom<A[K] | undefined> : EventStreamSeed<A[K]>;
export function view<A, B>(a: EventStreamSeed<A>, lens: L.Lens<A, B>): EventStreamSeed<B>;

export function view<A, B>(atom: ObservableSeed<any, any>, view: any): any {
    const lens = mkView(view)
    const desc = `${atom}.view(${toString(view)})`
    if (atom instanceof Atom) {
        return new LensedAtom<A, B>(desc, atom.consume(), lens)     
    } else {
        return rename(desc, map(atom as any, lens.get))
    }
}

function mkView(view: any) {
    if (typeof view === "string") {
        return L.prop<any, any>(view)
    }
    else if (typeof view === "number") {                        
        return L.item(view as number)
    } else {
        return view
    }   
}