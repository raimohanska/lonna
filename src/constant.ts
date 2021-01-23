import { Property } from "./abstractions";
import { never } from "./never";
import { globalScope } from "./scope";
import { toProperty } from "./toproperty";
import { rename, toString } from "./util";

export function constant<A>(value: A): Property<A> {
    return rename(() => `constant(${toString(value)})`, toProperty(value, globalScope)(never()))
}