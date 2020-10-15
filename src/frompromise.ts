import { endEvent, Event, Observer, Property, valueEvent } from "./abstractions"
import { StatelessProperty } from "./property"
import { globalScope } from "./scope"
import { toString } from "./tostring"

export type PromiseState<O> = PromisePending | PromiseResolved<O> | PromiseRejected
export type PromisePending = { state: "pending" }
export type PromiseResolved<O> = { state: "resolved", value: O }
export type PromiseRejected = { state: "rejected", error: Error }

export function fromPromise<I>(promise: Promise<I>): Property<PromiseState<I>>
export function fromPromise<I>(promise: Promise<any>, mapper?: any): any {
    let currentState: PromiseState<I> = { state: "pending" }
    promise.then(
        value => {
            currentState = { state: "resolved", value }
        },
        error => {
            currentState = { state: "rejected", error }
        }
    )   

    const onChange = (o: PromiseObserver<I>) => {
        let observer: PromiseObserver<I> | null = o
        function update(state: PromiseState<I>) {
            if (observer) {
                observer(valueEvent(state))
                observer(endEvent)
            }
        }
        if (currentState.state === "pending") {
            promise.then(
                value => {
                    console.log("Update observer", value)
                    update({ state: "resolved", value })
                },
                error => {
                    update({ state: "rejected", error })
                }
            )   
        } else {
            observer(endEvent)
        }
        return () => {
            observer = null
        }
    }

    const get = () => currentState

    return new StatelessProperty(`fromPromise(${toString(promise)})`, get, onChange, globalScope)
}

type PromiseObserver<I> = Observer<Event<PromiseState<I>>>