import { endEvent, Event, EventStream, EventStreamSeed, isEnd, isValue, Observable, Property, PropertySeed, toEvent, toEvents, valueEvent } from "./abstractions";
import { StatefulEventStream, fromSubscribe } from "./eventstream";
import { sequentially } from "./sequentially";
import { createScope, Scope } from "./scope";
import { applyScope } from "./applyscope";
import GlobalScheduler, { setScheduler } from "./scheduler";
import TickScheduler from "./tickscheduler";
import { map } from "./map";

export function wait(delay: number): Promise<void> {
    return new Promise((resolve) => GlobalScheduler.scheduler.setTimeout(resolve, delay))
}

export const sc = TickScheduler();
setScheduler(sc);

let seqs: StatefulEventStream<any>[] = [];

const verifyCleanup = () => {
    try {
        for (let seq of seqs) {
            expect(seq.dispatcher.hasObservers()).toEqual(false);
        }
    } finally {
        seqs = [];
    }
};

let testScope = createScope()
export function scope(): Scope { return testScope.apply }

function regSrc<V>(source: EventStream<V>) {
    seqs.push(source as StatefulEventStream<V>);
    return source;
};

export function series<V>(interval: number, values: (V | Event<V>)[]): EventStream<V> { return regSrc(sequentially<V>(interval, values, testScope.apply)) }


export const expectStreamEvents = (src: () => EventStream<any> | EventStreamSeed<any>, expectedEvents: any[]): void => {
    return verifySingleSubscriber(src, expectedEvents);
};

export const expectStreamTimings = <V>(src: () => EventStream<any> | EventStreamSeed<any>, expectedEventsAndTimings: [number, V][]) => {
    const srcWithRelativeTime = () => {
      const { now } = sc;
      const t0 = now();
      const relativeTime = () => Math.floor(now() - t0);
      const withRelativeTime = (x: V) => [relativeTime(), x];
      return map(src(), withRelativeTime);
    };
    return expectStreamEvents(srcWithRelativeTime, expectedEventsAndTimings);
  };

const verifySingleSubscriber = (srcF: () => EventStream<any> | EventStreamSeed<any>, expectedEvents: any[]): void => {
    verifyStreamWith("(single subscriber)", srcF, expectedEvents, (src, events, done) => {
        return src.subscribe((event: Event<any>) => {
            if (isValue(event)) {
                events.push(toValue(event));
            } else if (isEnd(event)) {
                done();
            } else {
                throw Error("Unknown event " + event)
            }
        })
    })
};

const verifyStreamWith = (description: string, srcF: () => EventStream<any> | EventStreamSeed<any>, expectedEvents: Event<any>[], collectF: (src: Observable<any>, events: Event<any>[], done: () => void) => any) =>
    describe(description, () => {
        let src: EventStream<any>;
        const receivedEvents: Event<any>[] = [];
        testScope = createScope()

        beforeAll(() => {
            testScope.start()
            const seed = srcF();
            src = (seed instanceof EventStream) ? seed : applyScope(testScope.apply, seed)
            expect(src instanceof EventStream).toEqual(true);
        });
        beforeAll(done => collectF(src, receivedEvents, done));
        it("outputs expected values in order", () => {
            expect(toValues(receivedEvents)).toEqual(toValues(expectedEvents))
        });
        it("the stream is exhausted", () => verifyExhausted(src));
        it("cleans up observers", () => {
            testScope.end()
            verifyCleanup();
        });
    });

export const expectPropertyEvents = (src: () => Property<any> | PropertySeed<any>, expectedEvents: any[], param: any = {}) => {
    const { unstable, semiunstable, extraCheck } = param;
    expect(expectedEvents.length > 0).toEqual(true);
    verifyPSingleSubscriber(src, expectedEvents, extraCheck);
};

var verifyPSingleSubscriber = (srcF: () => Property<any> | PropertySeed<any>, expectedEvents: Event<any>[], extraCheck: (Function | undefined) = undefined) =>
    verifyPropertyWith("(single subscriber)", srcF, expectedEvents, ((src: Property<any>, events: Event<any>[], done: (err: (Error | void)) => any) => {
        src.subscribe((event: Event<any>) => {
            if (isValue(event)) {
                events.push(event);
                expect(src.get()).toEqual(event.value)
            } else if (isEnd(event)) {
                done(undefined);
            } else {
                throw Error("Unknown event " + event)
            }
        });
    }), extraCheck)
    ;

const verifyPropertyWith = (description: string, srcF: () => Property<any> | PropertySeed<any>, expectedEvents: Event<any>[], collectF: (src: Property<any>, events: Event<any>[], done: () => void) => void, extraCheck: (Function | undefined) = undefined) =>
    describe(description, () => {
        let src: Property<any>;
        const events: Event<any>[] = [];
        beforeAll(() => {
            testScope.start()
            const seed = srcF();
            src = (seed instanceof Property) ? seed : applyScope(testScope.apply, seed) as Property<any>
        });
        beforeAll(done => collectF(src, events, done));
        it("is a Property", () => expect(src instanceof Property).toEqual(true));
        it("outputs expected events in order", () => expect(toValues(events)).toEqual(toValues(expectedEvents)));
        it("has correct final state", () => verifyFinalState(src, expectedEvents[expectedEvents.length - 1]));
        it("cleans up observers", () => {
            testScope.end()
            verifyCleanup();
        });
        if (extraCheck != undefined) {
            extraCheck();
        }
    })
    ;

var verifyFinalState = (property: Property<any>, value: any) => {
    verifyExhausted(property)
    expect(property.get()).toEqual(toValue(value))
};

const verifyExhausted = (src: Observable<any>) => {
    const events: Event<any>[] = [];
    src.subscribe((event: Event<any>) => {
        if (event === undefined) {
            throw new Error("got undefined event");
        }
        events.push(event);
    });
    if (events.length === 0) {
        throw new Error("got zero events");
    }
    expect(isEnd(events[0])).toEqual(true);
};
const toValues = (xs: Event<any>[]) => xs.map(toValue);
const toValue = (x: Event<any> | any) => {
    const event = toEvent(x)
    if (isValue(event)) return event.value
    return "<end>"
};

export function atGivenTimes<V>(timesAndValues: [number, V][]): EventStreamSeed<V> {
    const startTime = sc.now();
    return fromSubscribe((sink) => {
        let shouldStop = false;
        var schedule = (timeOffset: number, index: number) => {
            const first = timesAndValues[index];
            const scheduledTime = first[0];
            const delay = (scheduledTime - sc.now()) + startTime;
            const push = () => {
                if (shouldStop) {
                    return;
                }
                const value = first[1];
                sink(valueEvent(value));
                if (!shouldStop && ((index + 1) < timesAndValues.length)) {
                    return schedule(scheduledTime, index + 1);
                } else {
                    return sink(endEvent);
                }
            };
            return sc.setTimeout(push, delay);
        };
        schedule(0, 0);
        return () => shouldStop = true;
    });
};