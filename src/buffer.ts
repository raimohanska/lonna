import { Event, EventStreamSeed, isValue, Observer, valueEvent } from "./abstractions";
import GlobalScheduler from "./scheduler";
import { StreamTransformer, transform, Transformer } from "./transform";
import { nop } from "./util";

export type VoidFunction = () => void
/**
 *  Delay function used by `bufferWithTime` and `bufferWithTimeOrCount`. Your implementation should
 *  call the given void function to cause a buffer flush.
 */
export type DelayFunction = (f: VoidFunction) => any

export function bufferWithTime<V>(src: EventStreamSeed<V>, delay: number | DelayFunction): EventStreamSeed<V[]> {
  return bufferWithTimeOrCount(src + `.bufferWithTime(${delay})`, src, delay, Number.MAX_VALUE)
};

export function bufferWithCount<V>(src: EventStreamSeed<V>, count: number): EventStreamSeed<V[]> {
  return bufferWithTimeOrCount(src + `.bufferWithCount(${count})`, src, undefined, count)
};


function bufferWithTimeOrCount<V>(desc: string, src: EventStreamSeed<V>, delay?: number | DelayFunction, count?: number): EventStreamSeed<V[]> {
  const delayFunc = toDelayFunction(delay)
  function flushOrSchedule(buffer: Buffer<V>) {
    if (buffer.values.length === count) {
      //console.log Bacon.scheduler.now() + ": count-flush"
      return buffer.flush();
    } else if (delayFunc !== undefined) {
      return buffer.schedule(delayFunc);
    }
  }
  return buffer(desc, src, flushOrSchedule, flushOrSchedule)
}

// Commented-out end handling from Bacon

class Buffer<V> {
  constructor(onFlush: BufferHandler<V>, onInput: BufferHandler<V>) {
    this.onFlush = onFlush
    this.onInput = onInput
  }
  delay?: DelayFunction
  onInput: BufferHandler<V>
  onFlush: BufferHandler<V>
  push: Observer<Event<V[]>> = (e) => undefined
  scheduled: number | null = null
  end: Event<V[]> | undefined = undefined
  values: V[] = []
  flush() {
    if (this.scheduled) {
      GlobalScheduler.scheduler.clearTimeout(this.scheduled);
      this.scheduled = null;
    }
    if (this.values.length > 0) {
      //console.log Bacon.scheduler.now() + ": flush " + @values
      var valuesToPush = this.values;
      this.values = [];
      this.push(valueEvent(valuesToPush));
      if ((this.end != null)) {
        return this.push(this.end);
      } else {
        return this.onFlush(this);
      }
    } else {
      if ((this.end != null)) { return this.push(this.end); }
    }
  }
  schedule(delay: DelayFunction) {
    if (!this.scheduled) {
      return this.scheduled = delay(() => {
        //console.log Bacon.scheduler.now() + ": scheduled flush"
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
      //console.log Bacon.scheduler.now() + ": schedule for " + (Bacon.scheduler.now() + delayMs)
      return GlobalScheduler.scheduler.setTimeout(f, delayMs);
    };
  }
  return delay
}

type BufferHandler<V> = (buffer: Buffer<V>) => any

/** @hidden */
function buffer<V>(desc: string, src: EventStreamSeed<V>, onInput: BufferHandler<V> = nop, onFlush: BufferHandler<V> = nop): EventStreamSeed<V[]> {
  //var reply = more;
  var buffer = new Buffer<V>(onFlush, onInput)
  const transformer: StreamTransformer<V, V[]> = (event: Event<V>, sink: Observer<Event<V[]>>) => {
    buffer.push = sink
    if (isValue(event)) {
      buffer.values.push(event.value);
      //console.log Bacon.scheduler.now() + ": input " + event.value
      onInput(buffer);
    } else {
      buffer.end = event;
      if (!buffer.scheduled) {
        //console.log Bacon.scheduler.now() + ": end-flush"
        buffer.flush();
      }
    }
  }
  return transform<V, V[]>(desc, src, transformer)
};
