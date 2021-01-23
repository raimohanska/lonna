import { endEvent, Event, Observer, Property, valueEvent } from "./abstractions"
import { map } from "./map"
import { StatelessProperty } from "./property"
import { globalScope } from "./scope"
import { toString } from "./tostring"
import { nop } from "./util"

// TODO: flatmap cases would work better with stream semantics (no need for init)
// TODO: type inference doesn't really work with mapper
export type PromiseMapper<I, O> = [() => O, (resolved: I) => O, (rejected: Error) => O]

export type PromiseState<O> = PromisePending | PromiseResolved<O> | PromiseRejected
export type PromisePending = { state: "pending" }
export type PromiseResolved<O> = { state: "resolved", value: O }
export type PromiseRejected = { state: "rejected", error: Error }

export function fromPromise<I, O>(promise: Promise<I>, ...mapper: PromiseMapper<I, O>): Property<O>
export function fromPromise<I>(promise: Promise<I>): Property<PromiseState<I>>
export function fromPromise<I>(promise: Promise<any>, ...mapper: any): any {
    let currentState: PromiseState<I> = { state: "pending" }
    promise.then(
        value => {
            currentState = { state: "resolved", value }
        },
        error => {
            currentState = { state: "rejected", error }
        }
    )   

    const onChange = (_onValue: PromiseObserver<I>, onEnd: Observer<void> = nop) => {
        let onValue: PromiseObserver<I> | null = _onValue
        function update(state: PromiseState<I>) {
            if (onValue) {
                onValue(state)
                onEnd()
            }
        }
        if (currentState.state === "pending") {
            promise.then(
                value => {
                    update({ state: "resolved", value })
                },
                error => {
                    update({ state: "rejected", error })
                }
            )   
        } else {
            onEnd()
        }
        return () => {
            onValue = null
        }
    }

    const get = () => currentState

    const property = new StatelessProperty(() => `fromPromise(${toString(promise)})`, get, onChange, globalScope)

    if (mapper.length > 0) {
        return map((state: PromiseState<any>) => {
            if (state.state === "pending") return mapper[0]()
            if (state.state === "resolved") return mapper[1](state.value)
            return mapper[2](state.error)
        })(property)
    }

    return property
}

type PromiseObserver<I> = Observer<PromiseState<I>>