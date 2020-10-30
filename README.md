## Lonna

Experimental FRP library for Graphical User Interfaces. To be used in my [Harmaja](https://github.com/raimohanska/harmaja) project.

Compared to Bacon.js

- Stateful Properties and EventStreams have an explicit `scope` which guarantees that they stay up-to-date for the required period. Scope can be global (active forever) or more limited, such as a GUI component lifetime. Access outside the explicit scope will cause thrown Errors.
- `EventStreamSeed` and `PropertySeed` abstractions for streams and properties that don't have a `scope`. These can be mapped, filtered etc, but need to be scoped before accessing the value. They are very lightweight which may prove to be a major performance improvement: when creating temporary streams in flatMap, for instance, there's no need to create a Dispatcher for everything.
- The `scope` decouples subscribers from EventStream/Property activation. This means that "cold observables" like `Bacon.once` cannot be EventStreams in Lonna. They will be `EventStreamSeeds` (what should I call it?) and can be used in constructs like `flatMap` as intermediary Observables.
- `get<A>(p: Property<A>):A` method for reliable synchronous access to current value. Also, a Property *always* has a value. This is possible because `scope` guarantees freshness.
- More flexible Property interface that makes it easy to create properties that, for instance, extract their current value from the DOM or other external synchrnous source. 
- Properties and Atoms always automatically skip duplicates, so no need for `.skipDuplicates` like in Bacon
- No Error events. I've found them quite counterproductive in my use cases. 
- Simpler dispatch system, no Atomic Updates. However, when decomposition using map/combine is stateless which in itself guarantees that composed/decomposed state remains in sync
- Atoms included for read-write state, similarly Bus for read-write streams. Rudimentary lens system included for decomposing state.
- API consists of static methods instead of prototype methods. Is tree-shakable and easier to extend.
- No global state, no `instanceof` checks => no problems even when running two Lonna instances in the same application (as long as there are no breaking changes between versions)
