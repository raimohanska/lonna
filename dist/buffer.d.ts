import { EventStream, EventStreamSeed } from "./abstractions";
export declare type VoidFunction = () => void;
/**
 *  Delay function used by `bufferWithTime` and `bufferWithTimeOrCount`. Your implementation should
 *  call the given void function to cause a buffer flush.
 */
export declare type DelayFunction = (f: VoidFunction) => any;
export declare function bufferWithTime<V>(src: EventStream<V> | EventStreamSeed<V>, delay: number | DelayFunction): EventStreamSeed<V[]>;
export declare function bufferWithCount<V>(src: EventStream<V> | EventStreamSeed<V>, count: number): EventStreamSeed<V[]>;
