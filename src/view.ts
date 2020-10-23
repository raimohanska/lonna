import { Atom, EventStream, EventStreamSeed, ObservableSeed, Property, PropertySeed } from "./abstractions";
import { LensedAtom } from "./atom";
import * as L from "./lens";
import { map } from "./map";
import { rename, toString } from "./util";
import { Function1, Function2, Function3, Function4, Function5, Function6 } from "./abstractions";
import { combine } from "./combine";

export function view<A, K extends keyof A>(a: Atom<A>, key: K): K extends number ? Atom<A[K] | undefined> : Atom<A[K]>;
export function view<A, B>(a: Atom<A>, lens: L.Lens<A, B>): Atom<B>;
export function view<A, K extends keyof A>(a: Property<A>, key: K): K extends number ? Property<A[K] | undefined> : Property<A[K]>;
export function view<A, B>(a: Property<A>, lens: L.Lens<A, B>): Property<B>;

export function view<V, R>(a: Property<V>, fn: Function1<V, R>): Property<R>
export function view<V, V2, R>(a: Property<V>, b: Property<V2>, fn: Function2<V, V2, R>): Property<R>
export function view<V, V2, V3, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, fn: Function3<V, V2, V3, R>): Property<R>
export function view<V, V2, V3, V4, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, fn: Function4<V, V2, V3, V4, R>): Property<R>
export function view<V, V2, V3, V4, V5, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, fn: Function5<V, V2, V3, V4, V5, R>): Property<R>
export function view<V, V2, V3, V4, V5, V6, R>(a: Property<V>, b: Property<V2>, c: Property<V3>, d: Property<V4>, e: Property<V5>, f: Property<V6>, fn: Function6<V, V2, V3, V4, V5, V6, R>): Property<R>

export function view<A, B>(...args: any[]): any {
    if (args[1] instanceof Property || args[1] instanceof Function) {
        // properties + function
        const properties = args.slice(0, args.length - 1)
        const fn = args[args.length - 1]
        if (!(fn instanceof Function)) {
            throw Error("Expecting n properties + function")
        }
        return combine(properties, fn)
    } else {
        // property/atom + lens
        const atom = args[0]
        const view = args[1]
        const lens = mkView(view)
        const desc = `${atom}.view(${toString(view)})`
        if (atom instanceof Atom) {
            return new LensedAtom<A, B>(desc, atom.consume(), lens)     
        } else {
            return rename(desc, map(lens.get)(atom as any))
        }
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