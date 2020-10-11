"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentsToObservablesAndFunction = exports.argumentsToObservables = void 0;
var abstractions_1 = require("./abstractions");
var property_1 = require("./property");
/** @hidden */
function argumentsToObservables(args) {
    args = (Array.prototype.slice.call(args));
    return args.flatMap(singleToObservables);
}
exports.argumentsToObservables = argumentsToObservables;
function singleToObservables(x) {
    if (abstractions_1.isObservable(x)) {
        return [x];
    }
    else if (x instanceof Array) {
        return argumentsToObservables(x);
    }
    else {
        return [property_1.constant(x)];
    }
}
/** @hidden */
function argumentsToObservablesAndFunction(args) {
    if (args[0] instanceof Function) {
        return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
    }
    else {
        return [argumentsToObservables(Array.prototype.slice.call(args, 0, args.length - 1)), args[args.length - 1]];
    }
}
exports.argumentsToObservablesAndFunction = argumentsToObservablesAndFunction;
//# sourceMappingURL=argumentstoobservables.js.map