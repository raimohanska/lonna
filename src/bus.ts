import { Bus, endEvent, valueEvent } from "./abstractions"
import { StatefulEventStream } from "./eventstream"
import { globalScope } from "./scope"

export function bus<V>(): Bus<V> {
    return new BusImpl<V>()
}

// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
class BusImpl<V> extends StatefulEventStream<V> implements Bus<V> {
    constructor() {
        super("bus", globalScope)
        this.push = this.push.bind(this)
    }

    push(newValue: V) {
        this.dispatcher.dispatch("value", valueEvent(newValue))
    }

    end() {
        this.dispatcher.dispatch("value", endEvent)
    }
}