## Codename Eggs

Experimental FRP library for Graphical User Interfaces.

Compared to Bacon.js

- API consists of static methods instead of prototype methods. Is tree-shakable and easier to extend.
- Stateful Properties have an explicit `scope` which guarantees that they stay up-to-date for the required period. Scope can be global (active forever) or more limited, such as a GUI component lifetime. Access outside the explicit scope will cause thrown Errors.
- `get()` method in Properties for reliable synchronous access to current value. Also, a Property *always* has a value
- `EventStreamSeed` and `PropertySeed` abstractions for streams and properties that don't have a bound state. These can be mapped, filtered etc, but need to be scoped before accessing the value.
- Atoms included for read-write state

TODO list of Bacon.js methods for first real-life use case:

- `sampledBy`
- `map` variant that accepts a Property as value. Requires `sampledBy` first.
- `throttle`
- `changes`
- `debounce`
- `combineTemplate`
- `fromPoll`

To complete examples, we need

- `repeat`: would require stream end event
- `flatMapLatest`
- `fromEvent`
- `update`
- `once`
- `fromPromise` - needs to map into a tri-value thing: pending-error-value

Serious consideration: make the API pipeable.