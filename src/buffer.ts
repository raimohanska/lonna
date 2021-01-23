import { Desc, Event, EventStream, EventStreamSeed, isValue, Observer, valueEvent } from "./abstractions";
import GlobalScheduler from "./scheduler";
import { StreamTransformer, transform } from "./transform";
import { nop } from "./util";

export type VoidFunction = () => void
/**
 *  Delay function used by `bufferWithTime` and `bufferWithTimeOrCount`. Your implementation should
 *  call the given void function to cause a buffer flush.
 */
export type DelayFunction = (f: VoidFunction) => any

export function bufferWithTime<V>(delay: number | DelayFunction): (src: EventStream<V> | EventStreamSeed<V>) => EventStreamSeed<V[]> {
  return src => bufferWithTimeOrCount(() => `bufferWithTime(${delay})`, src, delay, Number.MAX_VALUE)
};

export function bufferWithCount<V>(count: number): (src: EventStream<V> | EventStreamSeed<V>) => EventStreamSeed<V[]> {
  return src => bufferWithTimeOrCount(() => `bufferWithCount(${count})`, src, undefined, count)
};


function bufferWithTimeOrCount<V>(desc: Desc, src: EventStream<V> | EventStreamSeed<V>, delay?: number | DelayFunction, count?: number): EventStreamSeed<V[]> {
  const delayFunc = toDelayFunction(delay)
  function flushOrSchedule(buffer: Buffer<V>) {
    if (buffer.values.length === count) {
      return buffer.flush();
    } else if (delayFunc !== undefined) {
      return buffer.schedule(delayFunc);
    }
  }
  return buffer(desc, src, flushOrSchedule, flushOrSchedule)
}

class Buffer<V> {
  constructor(onFlush: BufferHandler<V>, onInput: BufferHandler<V>) {
    this.onFlush = onFlush
    this.onInput = onInput
  }
  delay?: DelayFunction
  onInput: BufferHandler<V>
  onFlush: BufferHandler<V>
  onValue: Observer<V[]> = (e) => undefined
  onEnd: Observer<void> = (e) => undefined
  scheduled: number | null = null
  ended: boolean = false
  values: V[] = []
  flush() {
    if (this.scheduled) {
      GlobalScheduler.scheduler.clearTimeout(this.scheduled);
      this.scheduled = null;
    }
    if (this.values.length > 0) {
      var valuesToPush = this.values;
      this.values = [];
      this.onValue(valuesToPush);
      if ((this.ended)) {
        this.onEnd();
      } else {
        this.onFlush(this);
      }
    } else {
      if ((this.ended)) { this.onEnd(); }
    }
  }
  schedule(delay: DelayFunction) {
    if (!this.scheduled) {
      return this.scheduled = delay(() => {
        return this.flush();
      });
    }
  }

}

function toDelayFunction(delay: number | DelayFunction | undefined): DelayFunction | undefined {
  if (delay === undefined) {
    return undefined
  }
  if (typeof delay === "number") {
    var delayMs = delay;
    return function(f) {
      return GlobalScheduler.scheduler.setTimeout(f, delayMs);
    };
  }
  return delay
}

type BufferHandler<V> = (buffer: Buffer<V>) => any

function buffer<V>(desc: Desc, src: EventStream<V> | EventStreamSeed<V>, onInput: BufferHandler<V> = nop, onFlush: BufferHandler<V> = nop): EventStreamSeed<V[]> {
  const transformer: StreamTransformer<V, V[]> = subscribe => (onValue, onEnd = nop) => {
    var buffer = new Buffer<V>(onFlush, onInput)
    buffer.onValue = onValue
      buffer.onEnd = onEnd
      return subscribe(value => {
        buffer.values.push(value);
        onInput(buffer);
      }, () => {
        buffer.ended = true;
        if (!buffer.scheduled) {
          buffer.flush();
        }
      })
  }  
  return transform<V, V[]>(desc, transformer)(src)
};
