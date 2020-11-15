import { Scope, ScopeFn, Unsub, valueEvent } from "./abstractions"
import { Dispatcher } from "./dispatcher"

export class MutableScope extends Scope {
    start: () => void;
    end: () => void;
    constructor(fn: ScopeFn, start: () => void, end: () => void) {
        super(fn)
        this.start = start
        this.end = end
    }
}

export const globalScope: Scope = mkScope((onIn) => {
    onIn()
})

export function mkScope(scopeFn: ScopeFn): Scope {
    return new Scope(scopeFn)
}

type OnIn = () => Unsub
type OnOut = () => void

export function createScope(): MutableScope {
    let started = false
    let ended = false
    const ins: OnIn[] = []
    const outs: OnOut[] = []
    
    return new MutableScope(
        (onIn: OnIn, dispatcher?: Dispatcher<any>) => {
            let onOut : Unsub | null = null
            if (started) {
                onOut = onIn()
                outs.push(onOut)
            } else {
                ins.push(onIn)                
            }
                    
        },        
        () => {
            started = true
            for (let i of ins) {
                outs.push(i())
            }
            ins.splice(0)            
        },
        () => {
            started = false
            ended = true
            for (let o of outs) {
                o()
            }
            outs.splice(0)            
        }
    )
}

/**
 *  Subscribe to source when there are observers. Use with care! 
 **/
export function autoScope(): Scope {
    let d: Dispatcher<any> | null = null
    return mkScope((onIn, dispatcher) => {
        if (dispatcher) {
            if (!d) {
                d = dispatcher
            } else {
                if (d !== dispatcher) throw Error("Assertion failed")
            }
        }
        if (!d) {
           throw Error("Not in scope yet")
        }
        let unsub : Unsub | null = null 
        if (d.hasObservers()) {
            unsub = onIn()
        }
        let ended = false
        d.onObserverCount(count => {
            if (count > 0) {
                if (ended) throw new Error("autoScope reactivation attempted")
                unsub = onIn()
            } else {
                ended = true
                unsub!()
            }
        })
    })
}

export const beforeScope = {}
export const afterScope = {}
export type OutOfScope = (typeof beforeScope) | (typeof afterScope)

export function checkScope<V>(thing: any, value: V | OutOfScope): V {
    if (value === beforeScope) throw Error(`${thing} not in scope yet`);
    if (value === afterScope) throw Error(`${thing} not in scope any more`);
    return value as V
}