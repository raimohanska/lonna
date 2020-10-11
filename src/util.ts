import { Observer, Event, isValue, Observable } from "./abstractions"

export function duplicateSkippingObserver<V>(initial: V, observer: Observer<Event<V>>) {
    let current = initial
    return (event: Event<V>) => {        
        if (isValue(event)) {
            if (event.value !== current) {
                current = event.value
                observer(event)
            }
        } else {
            observer(event)
        }
    }
}

export function nop() {
}

export function remove<A>(xs: A[], x: A) {
    for (let i = 0; i < xs.length; i++) {
        if (xs[i] === x) {
            xs.splice(i, 1)
            return
        }
    }
}

export function rename(desc: string, observable: Observable<any>): Observable<any> {
    observable.desc = desc
    return observable
}