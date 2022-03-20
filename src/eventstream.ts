import {
  Event,
  EventLike,
  EventStream,
  EventStreamSeed,
  EventStreamSource,
  isEnd,
  ObservableSeed,
  Observer,
  Scope,
  Subscribe,
  toEvents,
  TypeBitfield,
  T_SOURCE,
  T_SCOPED,
  T_SEED,
  T_STREAM,
  Unsub,
  Desc,
} from "./abstractions"
import { applyScopeMaybe } from "./applyscope"
import { Dispatcher } from "./dispatcher"
import { HKT } from "./hkt"
import { ObservableBase, ObservableSeedImpl } from "./observable"
import { scopedSubscribe, scopedSubscribe1 } from "./scope"

type StreamEvents<V> = { value: V }

// TODO: consider how scopes should affect streams

export abstract class EventStreamBase<V>
  extends ObservableBase<V, EventStream<V>>
  implements EventStream<V>
{
  public [HKT]!: EventStream<V>
  observableType(): "EventStream" | "Bus" {
    return "EventStream"
  }
  _L: TypeBitfield = T_STREAM | T_SCOPED
  abstract getScope(): Scope
  applyScope(scope: Scope): EventStream<V> {
    return new StatelessEventStream(
      this.desc,
      scopedSubscribe1(scope, this.subscribe.bind(this)),
      scope
    )
  }
}

// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
export class StatefulEventStream<V> extends EventStreamBase<V> {
  protected dispatcher = new Dispatcher<StreamEvents<V>>()
  private _scope: Scope
  constructor(desc: Desc, scope: Scope) {
    super(desc)
    this._scope = scope
  }

  subscribe(onValue: Observer<V>, onEnd?: Observer<void>) {
    return this.dispatcher.on("value", onValue, onEnd)
  }
  getScope() {
    return this._scope
  }
}

export class StatelessEventStream<V> extends EventStreamBase<V> {
  observableType() {
    return "EventStream" as const
  }
  private _scope: Scope
  subscribe: Subscribe<V>

  constructor(desc: Desc, subscribe: Subscribe<V>, scope: Scope) {
    super(desc)
    this._scope = scope
    // No need to wrap subscribe with scope in EventStreams as there's no `get` method to protect unlike in Properties
    this.subscribe = subscribe
  }

  getScope() {
    return this._scope
  }
}

export class SeedToStream<V> extends StatefulEventStream<V> {
  observableType() {
    return "EventStream" as const
  }
  constructor(
    seed: ObservableSeed<V, EventStreamSource<V>, EventStream<V>>,
    scope: Scope
  ) {
    super(seed.desc, scope)
    const source = seed.consume()
    scope.subscribe(() =>
      source.subscribe(
        (v) => this.dispatcher.dispatch("value", v),
        () => this.dispatcher.dispatchEnd("value")
      )
    )
  }
}

export class EventStreamSourceImpl<V> extends ObservableBase<
  V,
  EventStream<V>
> {
  public [HKT]!: EventStreamSource<V>
  observableType() {
    return "EventStreamSource" as const
  }
  _L: TypeBitfield = T_STREAM | T_SOURCE
  subscribe: Subscribe<V>

  constructor(desc: Desc, subscribe: Subscribe<V>) {
    super(desc)
    this.subscribe = subscribe
  }

  applyScope(scope: Scope): EventStream<V> {
    return new SeedToStream(this, scope)
  }
}

export class EventStreamSeedImpl<V>
  extends ObservableSeedImpl<V, EventStreamSource<V>, EventStream<V>>
  implements EventStreamSeed<V>
{
  public [HKT]!: EventStreamSeed<V>
  observableType() {
    return "EventStreamSeed" as const
  }
  _L: TypeBitfield = T_STREAM | T_SEED
  constructor(desc: Desc, subscribe: Subscribe<V>) {
    super(new EventStreamSourceImpl(desc, subscribe))
  }

  applyScope(scope: Scope): EventStream<V> {
    return new SeedToStream(this, scope)
  }
}
