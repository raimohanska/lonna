## Lonna

Experimental FRP library for Graphical User Interfaces. Used in my [Harmaja](https://github.com/raimohanska/harmaja) project.

I have written this library to be more suitable than [Bacon.js](https://github.com/baconjs/bacon.js/) for my current UI programming needs. For context, I am the original author of the Bacon.js library so well so I know its limitations intimately.

Some day there may be a proper README, API docs and Tutorials for Lonna, but at the moment, this readme and the test cases in the [src] folder is all there is. Sorry for that! Help appreciated.

## Running examples

Here's a couple of simple examples on CodeSandbox.

- [Simple Contact List App](https://codesandbox.io/s/react-hooks-contacts-app-lonna-or53l) using React Hooks + Lonna. This is a conversion of the code introduced in my [Make React reactive by using Hooks](https://www.reaktor.com/blog/make-react-reactive-by-using-hooks/) blog post.
- [Todo Application](https://codesandbox.io/s/todoapp-harmaja-lonna-9xqw5?file=/src/App.tsx) using Harmaja + Lonna

Then there's a whole application written with Harmaja and Lonna.

- [R-Board online whiteboard](https://r-board.herokuapp.com/) is made with Lonna and Harmaja. Codebase [here](https://github.com/raimohanska/r-board).

## Tutorial

I assume you can read TypeScript, which I'm using the examples and which also is the native language of Lonna. 
For clarity, I'll be using a lot of explicit types, while in practice TypeScript can infer a lot of them for you.

As the Tutorial here is quite incomplete, I urge you to check out [Harmaja Readme](https://github.com/raimohanska/harmaja) for applied usage of Lonna.

### Atoms

If I think about application state, the first thing that comes to my mind is one ore more mutable variables. You manipulate the value of a variable and then you'll want your UI to reflect this change. For instance, for a value of type `A`, a simple mutable variable of type `var a:A;` alone won't do, because you'll need a mechanism of informing your UI about the changes to the variable when someone assigns a new value like `a=new A();`. Hence, Atom, which in a simplified form looks like this:

```typescript
type Atom<A> = {
    set(newValue: A): void;
    get(): A;
    update(modification: (oldValue: A) => A);
    forEach(callback: (newValue: A) => void;
}
```

You can use an Atom like this.

```typescript
import * as L from "lonna";
type Person = {
    nick: string,
    name: string
}
type State = {
    user: Person;
    friends: Person[]
}
const state: L.Atom<State> = L.atom<State>({ user: { nick: "raimohanska", name: "Juha" }, friends: [] });
state.get() // returns current state
state.set({ user: { nick: "raimohanska", name: "Juha" }, friends: [{ nick: "akheron", name: "Petri" }] });
state.forEach((s : State) => {
    // render your UI here
    // This callback is called immediately for the initial value,
    // as well as each time the value changes.
})
```

### Decomposing State with Views

Application UIs tend to be built from components. In a component you are like to be dealing with some "slice" of the application's state and often would prefer to have abstractions that expose only the desired part of application state
to your component. With Lonna Atoms, you can create a *view* into your state to gain a read-write
`Atom` representing a state slice. In the previous example the way I updated `friends` was clumsy in the way that I had to
replace the whole atom state instead of dealing with friends only. Instead I can do

```typescript
const friends: L.Atom<Person[]> = L.view(state, "friends"); // Yes, this is fully type-safe even though using a string.
friends.set([{ nick: "akheron", name: "Petri" }])
```

When I create a view to an Atom, I get another read-write Atom that reflects a part of the original Atom's state.
When I set a new value to the view Atom, the original Atom's value will be replaced.

In addition to field names as strings, numeric indices can be used to access array elements:

```typescript
const bestFriend: L.Atom<Person> = L.view(friends, 0);
const bestFriendName: L.Atom<string> = L.view(bestFriend, "name")
const currentValueOfName: string = bestFriendName.get()
```

For advanced read-write views into data, you can replace string keys and numeric indices with *Lenses* as defined in [Lens.ts](https://github.com/raimohanska/lonna/blob/master/src/lens.ts). [Optics-ts Lenses and Isomorphisms](https://github.com/akheron/optics-ts) are also supported out of the box.

### Read-only views for calculated values

Sometimes you may want to have a *calculated value* that depends on one or more of other dynamic values. You'll of course
want to be able to observe changes to this value and reflect it in your UI just like with Atom. You can do also this
with `L.view` by proving a function like this:

```typescript
const friends: L.Atom<Person[]>;
const numberOfFriends: L.Property<number> = L.view(friends, f => f.length);
```

The type of these read-only calculated values is `Property` which is like an `Atom` but lacks the `set` and `modify` methods. In fact, [`Atom<A> extends Property<A>`](https://github.com/raimohanska/lonna/blob/master/src/abstractions.ts#L166). Just like with Atoms, you can react to changes in a Property using `forEach`:

```typescript
numberOfFriends.forEach(n => console.log(`You have ${n} friends.`));
```

Duplicate values are automatically skipped, so if the contents of the `friends` array above changes but the length remains the
same, your side-effects are not run for these duplicate values. 

You can also create calculated values based on multiple `Atoms` or `Properties`:

```typescript
const friends: L.Property<Person[]>;
const myName: L.Property<string>;
const namesakes: L.Property<Person[]> = L.view(myName, friends, (n, fs) => {
    return fs.filter(f => f.name === n)
})
```

The views that are based on multiple inputs are, of course, updated when any of the inputs is changed. Then your "combinator function" is run for the new values. 

Duplicates in the result value are skipped just like for any Properties and Atoms. Lonna checks for equality using `===` internally. If you want to skip duplicates with a custom equality operator, such as deep equality, you can do so by using [`skipDuplicates`](https://github.com/raimohanska/lonna/blob/master/src/skipDuplicates.ts) like `value.pipe(T.skipDuplicates(equals))` assuming you had [equals](https://ramdajs.com/docs/#equals) imported from from Ramda.

### Values based on external events

You can use Lonna Properties to represent all kinds of state. Not just "application state" but also, for instance, cursor position, window scroll position, WebSocket connection status. Anything that has a current value, can change, and needs to be observed. Then you can view, transform and combine these values just like all other Properties.

You can, of course, create an Atom and update it's value based on external events, like here:

```typescript
const getScrollPos = () => Math.floor(window.scrollY);
const scrollPos: L.Property<number> = L.atom(getScrollPos());
window.addEventListener("scroll", () => scrollPos.set(getScrollPos());
```

And this is fine, in case you don't have to worry about removing that event listener. So, in a global context it's ok, but if you add this code in the constructor
of a UI component and instances of these components are created and disposed during your application lifetime, you'll have a resource leak unless you also call `window.removeEventListener` appropriately.

Hence, for values based on events, you may want to consider using `L.toStatelessProperty`. Here's how to get the [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) vertical scroll position "scrollY" as
an observable Property:

```typescript
const scrollPos: L.Property<number> = L.fromEvent(window, "scroll")
    .pipe(L.toStatelessProperty(() => Math.floor(window.scrollY)))

```

To break this down a bit, we start with `L.fromEvent(window, "scroll")` which gives us an `L.EventStream` that represents the 
Window "scroll" events as an observable stream. See the [EventStream](#eventstream) chapter for more. Then we use `L.toStatelessProperty` which creates a
Property that's updated each time an event occurs in the given EventStream and gets it's current value using the given function. In this case the value is got from `window.scrollY`.

Now because the Property created by `L.toStatelessProperty` is stateless and extracts its value from an external source on demand, there's no need for cleaning up listeners like in the Atom-based approach above. The result Property will start and stop listening to events based on the subscribers added to the Property itself. Which of course means that you'll need to deal with subscription lifecycle but that's something you'll have to deal with anyway and depending on your toolkit this will be more or less automated. See [Subscription Lifecycle](#subscription-lifecycle) for more.

### Unidirectional data flow

Unidirectional data flow, popularized by Redux, is a leading state management pattern in web frontends today. In short, it means that you have a (usually essentially) global data *store* or stores that represent pretty much the entire application state. Changes to this state are not effected directly by UI components but instead by dispacthing *events* or *actions* which then are processed by *reducers* and applied to the global state. The state is treated as an immutable object and every time the reducers applies a new change to state, it effectively creates an entire new state object. 

In Typescript, you could represent these concepts in the context of a Todo App like this:

```typescript
type Item = { id: Id, name: string }
type AppEvent = 
    { action: "add", name: string } | 
    { action: "remove", id: Id } |
    { action: "update", item: Item }
type State = {items: Item[]}
type Reducer = (currentState: State, event: AppEvent) => State
interface Store {
    dispatch(event: AppEvent)
    subscribe(observer: (event: AppEvent) => void)
}
```

In this scenario, UI components will `subscribe` to changes in the `Store` and `dispatch` events to effect state changes. The store will apply its `Reducer` to incoming events and the notify the observer components on updated state.

The benefits are (to many, nowadays) obvious. These come from the top of my mind.

- Reasoning about state changes is straightforward, as only reducers change state. You can statically backtrack all possible causes of a change to a particular part of application state.
- The immutable global state object makes persisting and restoring application state easier, and makes it possible to create and audit trail of all events and state history. It also makes it easier to pass the application state for browser-side hydration after a server-side render.
- Generally, reasoning about application logic is easier if there is a pattern, instead of a patchwork of ad hoc solutions

Implementations such as Redux allow components to *react* to a select part of global state (instead of all changes) to avoid expensive updates. With React hooks, you can conveniently just `useSelector(state => pick interesting parts)` and you're done.

It's not a silver bullet though. Especially when using a single global store with React / Redux

- There is no solution for local or scoped state. Sometimes you need scoped state that applies, for instance, to the checkout process of your web store. Or to widely used components such as an address selector. Or for storing pending changes to, say, user preferences before applying them to the global state.
- This leads to either using React local state or some "corner" of the global state for these transient pieces of state
- Refactoring state from local to global is tedious and error-prone because you use an entirely different mechanism for each
- You cannot encapsulate functionalities (store checkout) into self-sustaining components because they are dependent on reducers which lively somewhere else completely

Other interesting examples of Unidirectional data flow include [Elm](https://elm-lang.org/) and [Cycle.js](https://cycle.js.org/).

### Unidirectional data flow with Lonna

In Lonna, you can implement Unidirectional data flow too. Sticking with the Todo App example, you define your events as [*buses*](https://github.com/raimohanska/lonna/blob/master/src/abstractions.ts#L145):

```typescript
import * as L from "lonna"

type Item = { id: Id, name: string }
type AppEvent = 
    { action: "add", name: string } | 
    { action: "remove", id: Id } |
    { action: "update", item: Item }
const appEvents = L.bus<AppEvent>()
```

The bus objects allow you to dispatch an event by calling their `push` method. From the events, the application state can be reduced using [`L.scan`](https://github.com/raimohanska/lonna/blob/master/src/scan.ts) like thus:

```typescript
const initialItems: TodoItem[] = []
function reducer(items: TodoItem[], event: AppEvent): TodoItem[] {
  switch (event.action) {
    case "add": return items.concat(todoItem(event.name))
    case "remove": return items.filter(i => i.id !== event.id)
    case "update": return items.map(i => i.id === event.item.id ? event.item : i)
  }
}
const allItems: L.Property<TodoItem[]> = appEvents.pipe(L.scan(initialItems, reducer, L.globalScope))
```

The `L.globalScope` parameter is used to specify the lifetime of the `allItems` property, i.e. how long it will be kept up-to-date. When using `globalScope` the property updates will never stop. See the [Stateful views and Lifetimes](#stateful-views-and-lifetimes) chapter for more.
When creating statetul Properties within [Harmaja](https://github.com/raimohanska/harmaja) components, you can also use `componentScope()` from `import { componentScope } from "harmaja"`, to stop updates after the components has been unmounted.

You can, if you like, then encapsulate all this into something like

```typescript
interface TodoStore {
    dispatch: (action: AppEvent) => void
    items: L.Property<TodoItem[]>
}
```

...so you have an encapsulation of this piece of application state, and you can pass this store to your UI components.

### Bringing State Management patterns together with Lonna

So now, whether you base your application state on Atoms or Events and Reducers, you'll have composable Properties that present your application state. Remember that Atoms are also Properties, with the added mutation methods `set` and `modify`.

You can use both approaches and even combine them by creating *dependent atoms* that are based on a read-only Property and a way to dispatch changes upwards.

For example, in the Todo Application above, if we wanted to create an Atom to represent the state of a Todo Item on the list, we create such a *dependent atom* thus:

```typescript
    function itemAtom(index: number, store: TodoStore): L.Atom<Item> {
        const itemState: L.Property<TodoItem> = L.view(store.items, items => items[index])
        const setItemState = (newState: TodoItem) => store.dispatch({ action: "update", item: newState})
        return L.atom(itemState, setItemState)
    }    
```

### Subscription lifecycle

When you subscribe for the values of a `Property` or an `Atom` you may use the `forEach` method. In case your subscribing in essentially global code, you can leave it at that. If though you're subscribing in a Component that has a lifetime after which it is disposed, you'll need to pay attention. Just like for subscribing to any events using a method like [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), there needs to be away of *un*subscribing.

And indeed the `forEach` method provides a way to unsubscribe, by returning an `Unsub` function, like here:

```typescript
interface ForEach<V> {
    forEach(observer: Observer<V>): Unsub;
}
type Unsub = () => void
```

So you can unsubscribe like this.

```typescript
const unsub: L.Unsub = numberOfFriends.forEach(n => console.log(`You have ${n} friends.`));
// at some later phase we'll unsubscibe simply thus:

unsub();
```

Not unsubscribing can lead to memory leaks as well as unwanted behavior, when Lonna calls your callbacks while the UI 
component is already disposed.

No panic. In most cases you don't need to worry about this.

This is because you're likely to use Lonna with some helper facilities that will take care of subscription and unsubscription based on your UI components' lifecycle. For instance, with [Harmaja](https://github.com/raimohanska/harmaja) you
will just embed Properties into your UI and Harmaja will take of subscription and unsubscription when your DOM elements are mounted and unmounted. Similarly you can use a React Hook to take care of (un)subscription as in this [example](https://codesandbox.io/s/react-hooks-contacts-app-lonna-or53l).

### Abstractions

There's a bunch of abstractions mentioned in the above chapters. Now's a good time to have a look at them and how they fit the picture. They all all defined in [abstractions.ts](https://github.com/raimohanska/lonna/blob/master/src/abstractions.ts) so you might want to take a look there as well.

#### Observable

All of the abstractions below have something in common and that's `Observable<V>`, a source that emits values of type `V`. Different Observable implementations below have a bit different semantics as to when a value is emitted. Slightly simplifying it looks like this.

```typescript
type Unsub = () => void

interface Observable<V> {
    forEach(observer: Observer<V>): Unsub;
    subscribe(onValue: Observer<V>, onEnd?: Observer<void>): Unsub;
    log(message?: string): Unsub;
}
```

TODO: add typedocs to source code and copy here as well.

The interesting method is `forEach` for getting callbacks for all values emitted by this Observable. 

The `subscribe` method provides a way to react to end-of-updates as well, which is not usually useful application programming, but more for internal use and building new transforms, such as `map`, `filter` and `flatMap`.

Both subscription methods return an `Unsub` callback that you can use to stop listening for updates.

#### Property

A `Property<V>` is an `Observable<V>` that represents a read-only observable variable. A simplified representation looks like this:

```typescript
interface Propert<V> extends Observable<V> {
    /** Get current value */
    get(): V
    /** Callback for changes and end-of-updates. Not called for initial value. */
    onChange(onValue: Observer<V>, onEnd?: Observer<void> | undefined): Unsub;
}
```

So you can read the value synchronously as well as register for updates. The essential differene between using `forEach` and `onChange` is that the former calls your callback immediately with current value, followed by any updates, while the latter provides the updates only.


#### Atom

`Atom<V>` further builds on `Atom<V>`, including the `set` and `modify` methods for mutation.

```typescript
type Atom<V> = Property<V> & {
    set(newValue: V): void
    modify(fn: (old: V) => V): void
}
```

#### EventStream

While a `Property<V>` represents an observable variable of type `V`, and `EventStream<V>` represents a source of Events of type `V`. The main difference is that an EventStream does not have a current value. Instead it's used for representing individual events, like mouse clicks or web socket messages.

It does not add any methods to Observable, so it could be described as

```typescript
type EventStream<V> = Observable<V>;
```

#### Bus

The `Bus<V>` is an `EventStream<V>` which also allows pushing events into it. So for what Atom is to Property, a Bus is to EventStream.

```typescript
interface Bus<V> extends EventStream<V> {
    push(newValue: V): void
    end(): void
}
```

The interesting method here is `push`, while `end` is here mostly for completeness' sake - you can signal the end of the stream using it, so that subscribers implementing `onEnd` will be notified.

### Stateful views and Lifetimes

In Lonna, all stateful Properties have a *lifetime*, which was earlierly mentioned when dealing with `scan`. The lifetime determines the duration during which the observable will be kept up to date. This mechanism is needed to ensure that

1. All stateful Properties are kept up to date (instead of having possible stale values)
2. We also stop keeping them up to date when they are not needed (instead of leaking resources)

So when you create a stateful Property using methods such as `scan` or `filter`, you'll either need to provide a `Scope` parameter such as `L.globalScope` or you'll end up with a `PropertySeed` instead of a Property. A PropertySeed is best described as an object that can be turned into a Property by applying a lifetime using `L.applyScope`. 

When wouldn't I want to provide a Scope? In most cases it makes sense to provide a Scope, but sometimes you may find yourself building longer chains such as

```typescript
something.pipe(L.filter(f), L.flatmap(g), L.scan(h), L.applyScope(myScope));
```

In those cases it's both more convenient and performant to apply the scope at the end of the chain instead of applying it at every step.

The built-in Scopes in Lonna are

- `L.globalScope` that will keep your value up to date ad infinitum, i.e. for the whole lifetime of the Javascript runtime environment
- `L.autoScope` that will keep your value up to date as long as there are subscribers to your value. This may sound convenient but is not a silver bullet because `get` cannot be called before there are subscribers and also it will go out of scope after subscribers are removed. If you add new subscribers after that, it'll throw an Error. This behavior is intentional because the alternative would be to emit possible stale values
- `L.MutableScope` for a mutable scope object that you can manipulate with `start()` and `end()` methods
- `L.mkScope(fn)` for building your own scopes. See [scope.ts](https://github.com/raimohanska/lonna/blob/master/src/scope.ts)

In Harmaja, there is `componentScope()` for component lifetime.

TODO: Lifetimes in React Applications is unproven ground at the moment. Write a Hooks POC for this.

### Operations API

TODO: documentation for all the operations like map, filter, flatMap, combine...

### Optimizing

By default, Lonna views into Properties and Atoms are stateless. In practice this means that whenever the value is accessed using `get` or in a `forEach` or `onChange` callback, the value is calculated using whatever mapping/combinator functions you've provided in your `L.view` calls. IMO this is generally a good strategy in the sense that it guarantees that the values are always fresh (no cached stale values). However, if there are any expensive computations in the chain, you may want to optimize. This can be done using [`cached`](https://github.com/raimohanska/lonna/blob/master/src/cached.ts) like so.


```typescript
const v: L.Property<A>;
const vCached: L.Property<A> = v.pipe(L.cached<A>(scope));
```

Caching is of course stateful so you'll need to provide a Scope to get a Property, as above. Without a Scope you'll get a `PropertySeed` which can be later scoped into a `Property` as described in the Stateful views and Lifetimes chapter.

## Differences to Bacon.js

Here are the essential differences to Bacon.js.

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
