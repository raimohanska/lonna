/**
 * A polled function used by [fromPoll](../globals.html#frompoll)
 */
import { toEvents, EventLike, EventStream, EventStreamSeed, isEnd } from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { fromSubscribe } from "./eventstream"
import GlobalScheduler from "./scheduler"
import { Scope } from "./scope"
import { rename } from "./util"

export type PollFunction<V> = () => EventLike<V>

/**
 Polls given function with given interval.
 When there are subscribers to the stream. Polling ends permanently when
 `f` returns an End event.

 * @param delay poll interval in milliseconds
 * @param poll function to be polled. Can return either V, Event<V> or an array of Event<V>. In the latter cases the End event can be used to stop polling.
 * @typeparam V Type of stream elements
 */
export function fromPoll<V>(delay: number, poll: PollFunction<V>, scope: Scope): EventStream<V>
export function fromPoll<V>(delay: number, poll: PollFunction<V>): EventStreamSeed<V>

export function fromPoll<V>(delay: number, poll: PollFunction<V>, scope?: Scope): any {
  return rename(`fromPoll(${delay},fn)`, fromSubscribe((observer) => {
        const interval = GlobalScheduler.scheduler.setInterval(() => {
            const events = toEvents(poll())
            for (const event of events) {
                if (isEnd(event)) {
                    GlobalScheduler.scheduler.clearInterval(interval)
                }
                observer(event)
            }
        }, delay)
        return () => GlobalScheduler.scheduler.clearInterval(interval)
  }, scope as any));
}