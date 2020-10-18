import { EventStream, EventStreamSeed } from "./abstractions";
export declare type VoidFunction = () => void;
/**
 *  Delay function used by `bufferWithTime` and `bufferWithTimeOrCount`. Your implementation should
 *  call the given void function to cause a buffer flush.
 */
export declare type DelayFunction = (f: VoidFunction) => any;
export declare function bufferWithTime<V>(delay: number | DelayFunction): (src: EventStream<V> | EventStreamSeed<V>) => EventStreamSeed<V[]>;
export declare function bufferWithCount<V>(count: number): (src: EventStream<V> | EventStreamSeed<V>) => EventStreamSeed<V[]>;
