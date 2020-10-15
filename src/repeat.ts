import { endEvent, Event, EventStreamSeed, isEnd, Observable, ObservableSeed, Observer } from "./abstractions";
import { fromSubscribe } from "./eventstream";
import { rename } from "./util";

export function repeat<V>(generator: (iteration: number) => ObservableSeed<V, any>  | undefined): EventStreamSeed<V> {
    var index = 0;

    return rename("repeat(fn)", fromSubscribe<V>(function(sink: Observer<Event<V>>) {
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
    }))
  }