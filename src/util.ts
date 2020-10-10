import { Observer } from "./abstractions"
export function nop() {}
export function duplicateSkippingObserver<V>(initial: V, observer: Observer<V>) {
    let current = initial
    return (newValue: V) => {
        if (newValue !== current) {
            current = newValue
            observer(newValue)
        }
    }
}