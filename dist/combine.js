"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = exports.combineAsArray = void 0;
var abstractions_1 = require("./abstractions");
var property_1 = require("./property");
var scope_1 = require("./scope");
var argumentstoobservables_1 = require("./argumentstoobservables");
function combineAsArray(observables) {
    return combine(observables, function () {
        var xs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            xs[_i] = arguments[_i];
        }
        return xs;
    });
}
exports.combineAsArray = combineAsArray;
function combine() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = __read(argumentstoobservables_1.argumentsToObservablesAndFunction(args), 2), properties = _a[0], combinator = _a[1];
    function getCurrentArray() {
        return properties.map(function (s) { return s.get(); });
    }
    var get = function () { return combinator.apply(void 0, __spread(getCurrentArray())); };
    function subscribe(observer) {
        var endCount = 0;
        var unsubs = properties.map(function (src, i) {
            return src.onChange(function (event) {
                if (abstractions_1.isValue(event)) {
                    currentArray[i] = event.value;
                    observer(abstractions_1.valueEvent(combinator.apply(void 0, __spread(currentArray))));
                }
                else {
                    endCount++;
                    if (endCount == properties.length) {
                        observer(abstractions_1.endEvent);
                    }
                }
            });
        });
        var currentArray = getCurrentArray();
        return function () {
            unsubs.forEach(function (f) { return f(); });
        };
    }
    var desc = "combine(" + properties + ", fn)";
    if (properties.length === 0 || properties[0] instanceof abstractions_1.Property) {
        var scope = (properties.length === 0) ? scope_1.globalScope : properties[0].getScope();
        return new property_1.StatelessProperty(desc, get, subscribe, scope);
    }
    else {
        return new abstractions_1.PropertySeed(desc, get, subscribe);
    }
}
exports.combine = combine;
;
//# sourceMappingURL=combine.js.map