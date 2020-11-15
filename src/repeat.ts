import { endEvent, Event, EventStream, EventStreamSeed, isEnd, Scope, ObservableSeed, Observer } from "./abstractions";
import { applyScopeMaybe } from "./applyscope";
import { fromSubscribe } from "./fromsubscribe";
import { rename } from "./util";

export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any>  | undefined): EventStreamSeed<V>;
export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any>  | undefined, scope: Scope): EventStream<V>;


export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any>  | undefined, scope?: Scope): any {
    var index = 0;

    return applyScopeMaybe(rename("repeat(fn)", fromSubscribe<V>(function(sink: Observer<Event<V>>) {
      var flag = false;
      
      var unsub = function() {};
      function handleEvent(event: Event<V>) {
        if (isEnd(event)) {
          if (!flag) {
            flag = true;
          } else {
            subscribeNext();
          }
        } else {
          sink(event);
        }
      }
      function subscribeNext() {
        var next: ObservableSeed<V, any> | undefined;
        flag = true;
        while (flag) {
          next = generator(index++);
          flag = false;
          if (next) {
            unsub = next.consume().subscribe(handleEvent);
          } else {
            sink(endEvent);
          }
        }
        flag = true;
      }
      subscribeNext();
      return () => unsub();
    })), scope)
  }