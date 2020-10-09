import { endEvent, EventStream } from "./abstractions";
import { StatelessEventStream } from "./eventstream";
import { globalScope } from "./scope";
import { nop } from "./util";

export function never<A>(): EventStream<A> {
    return new StatelessEventStream<A>("never", observer => {
        observer(endEvent)
        return nop
    }, globalScope)
}