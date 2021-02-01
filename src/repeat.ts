import { endEvent, Event, EventStream, EventStreamSeed, isEnd, Scope, ObservableSeed, Observer } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { fromSubscribe } from "./fromsubscribe";
import { nop, rename } from "./util";

export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any, any>  | undefined): EventStreamSeed<V>;
export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any, any>  | undefined, scope: Scope): EventStream<V>;


export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any, any>  | undefined, scope?: Scope): any {
    var index = 0;

    return applyScopeMaybe(rename("repeat(fn)", fromSubscribe<V>(function(onValue: Observer<V>, onEnd: Observer<void> = nop) {
      var flag = false;
      
      var unsub = function() {};

      function handleEnd() {
        if (!flag) {
          flag = true;
        } else {
          subscribeNext();
        }
      }
      function subscribeNext() {
        var next: ObservableSeed<V, any, any> | undefined;
        flag = true;
        while (flag) {
          next = generator(index++);
          flag = false;
          if (next) {
            unsub = next.consume().subscribe(onValue, handleEnd);
          } else {
            onEnd()
          }
        }
        flag = true;
      }
      subscribeNext();
      return () => unsub();
    })), scope)
  }