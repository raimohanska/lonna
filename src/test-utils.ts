import {
  applyScope,
  createScope,
  endEvent,
  Event,
  EventStream,
  EventStreamSeed,
  fromSubscribe,
  isEnd,
  isEventStream,
  isProperty,
  isValue,
  Observable,
  Property,
  PropertySeed,
  Scope,
  sequentially,
  StatefulEventStream,
  toEvent,
  valueEvent,
} from "."
import { map } from "./map"
import GlobalScheduler, { setScheduler } from "./scheduler"
import { globalScope } from "./scope"
import TickScheduler from "./tickscheduler"
import { nop } from "./util"

export function wait(delay: number): Promise<void> {
  return new Promise((resolve) =>
    GlobalScheduler.scheduler.setTimeout(resolve, delay)
  )
}

export const sc = TickScheduler()
setScheduler(sc)

let seqs: StatefulEventStream<any>[] = []

const verifyCleanup = () => {
  try {
    for (let seq of seqs) {
      expect(hasObservers(seq)).toEqual(false)
    }
  } finally {
    seqs = []
  }
}

export function hasObservers(o: Observable<any>) {
  return (o as any).dispatcher.hasObservers()
}

let scope = createScope()

export function testScope(): Scope {
  return scope
}

function regSrc<V>(source: EventStream<V>) {
  seqs.push(source as StatefulEventStream<V>)
  return source
}

export function series<V>(
  interval: number,
  values: (V | Event<V>)[]
): EventStream<V> {
  return regSrc(sequentially<V>(interval, values, scope))
}

export const expectStreamEvents = (
  src: () => EventStream<any> | EventStreamSeed<any>,
  expectedEvents: any[]
): void => {
  return verifySingleSubscriber(src, expectedEvents)
}

export const expectStreamTimings = <V>(
  src: () => EventStream<any> | EventStreamSeed<any>,
  expectedEventsAndTimings: [number, V][]
) => {
  const srcWithRelativeTime = () => {
    const { now } = sc
    const t0 = now()
    const relativeTime = () => Math.floor(now() - t0)
    const withRelativeTime = (x: V) => [relativeTime(), x]
    return map(withRelativeTime)(src() as EventStreamSeed<any>)
  }
  return expectStreamEvents(srcWithRelativeTime, expectedEventsAndTimings)
}

const verifySingleSubscriber = (
  srcF: () => EventStream<any> | EventStreamSeed<any>,
  expectedEvents: any[]
): void => {
  verifyStreamWith(
    "(single subscriber)",
    srcF,
    expectedEvents,
    (src, events, done) => {
      const unsub = src.subscribe(
        (value: any) => {
          events.push(value)
        },
        () => {
          unsub && unsub()
          done()
        }
      )
    }
  )
}

const verifyStreamWith = (
  description: string,
  srcF: () => EventStream<any> | EventStreamSeed<any>,
  expectedEvents: Event<any>[],
  collectF: (
    src: Observable<any>,
    events: Event<any>[],
    done: () => void
  ) => any
) =>
  describe(description, () => {
    let src: EventStream<any>
    const receivedEvents: Event<any>[] = []
    scope = createScope()

    beforeAll(() => {
      scope.start()
      const seed = srcF()
      src = isEventStream(seed) ? seed : applyScope(scope)(seed)
      expect(isEventStream(src)).toEqual(true)
    })
    beforeAll((done) => collectF(src, receivedEvents, done))
    it("outputs expected values in order", () => {
      expect(toValues(receivedEvents)).toEqual(toValues(expectedEvents))
    })
    it("the stream is exhausted", () => verifyExhausted(src))
    it("cleans up observers", () => {
      scope.end()
      verifyCleanup()
    })
  })

export const expectPropertyEvents = (
  srcF: () => Property<any> | PropertySeed<any>,
  expectedEvents: any[],
  param: any = {}
) => {
  const { unstable, semiunstable, extraCheck } = param
  expect(expectedEvents.length > 0).toEqual(true)
  verifyPropertyWith(
    "(single subscriber)",
    srcF,
    expectedEvents,
    (
      src: Property<any>,
      events: Event<any>[],
      done: (err: Error | void) => any
    ) => {
      src.subscribe(
        (value: any) => {
          events.push(value)
          expect(src.get()).toEqual(value)
        },
        () => {
          done(undefined)
        }
      )
    },
    extraCheck
  )
  it("Can be subscribed to before scope begins", () => {
    const seed = srcF()
    const src = isProperty(seed)
      ? seed.getScope() === globalScope
        ? seed.applyScope(scope)
        : seed
      : (applyScope(scope)(seed) as Property<any>)
    const values: any[] = []
    const unsub = src.subscribe((v) => values.push(v))
    expect(values).toEqual([])
    unsub()
  })
}

const verifyPropertyWith = (
  description: string,
  srcF: () => Property<any> | PropertySeed<any>,
  expectedEvents: Event<any>[],
  collectF: (
    src: Property<any>,
    events: Event<any>[],
    done: () => void
  ) => void,
  extraCheck: Function | undefined = undefined
) => {
  describe(description, () => {
    let src: Property<any>
    const events: Event<any>[] = []
    beforeAll(() => {
      scope.start()
      const seed = srcF()
      src = isProperty(seed) ? seed : (applyScope(scope)(seed) as Property<any>)
    })
    beforeAll((done) => collectF(src, events, done))
    it("is a Property", () => expect(isProperty(src)).toEqual(true))
    it("outputs expected events in order", () =>
      expect(toValues(events)).toEqual(toValues(expectedEvents)))
    if (expectedEvents.length > 0) {
      it("has correct final state", () =>
        verifyFinalState(src, expectedEvents[expectedEvents.length - 1]))
    }
    it("cleans up observers", () => {
      scope.end()
      verifyCleanup()
    })
    if (extraCheck != undefined) {
      extraCheck()
    }
  })
}

var verifyFinalState = (property: Property<any>, value: any) => {
  verifyExhausted(property)
  expect(property.get()).toEqual(toValue(value))
}

const verifyExhausted = (src: Observable<any>) => {
  const events: Event<any>[] = []
  src.subscribe(
    (value: any) => {
      events.push(valueEvent(value))
    },
    () => {
      events.push(endEvent)
    }
  )
  if (events.length === 0) {
    throw new Error("got zero events")
  }
  expect(isEnd(events[0])).toEqual(true)
}
const toValues = (xs: Event<any>[]) => xs.map(toValue)
const toValue = (x: Event<any> | any) => {
  const event = toEvent(x)
  if (isValue(event)) return event.value
  return "<end>"
}

export function atGivenTimes<V>(
  timesAndValues: [number, V][]
): EventStreamSeed<V> {
  const startTime = sc.now()
  return fromSubscribe((onValue, onEnd = nop) => {
    let shouldStop = false
    var schedule = (timeOffset: number, index: number) => {
      const first = timesAndValues[index]
      const scheduledTime = first[0]
      const delay = scheduledTime - sc.now() + startTime
      const push = () => {
        if (shouldStop) {
          return
        }
        const value = first[1]
        onValue(value)
        if (!shouldStop && index + 1 < timesAndValues.length) {
          return schedule(scheduledTime, index + 1)
        } else {
          return onEnd()
        }
      }
      return sc.setTimeout(push, delay)
    }
    schedule(0, 0)
    return () => (shouldStop = true)
  })
}
