"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.each = exports.combineTemplate = void 0;
var abstractions_1 = require("./abstractions");
var combine_1 = require("./combine");
var map_1 = require("./map");
var property_1 = require("./property");
var util_1 = require("./util");
function combineTemplate(template) {
    function current(ctxStack) { return ctxStack[ctxStack.length - 1]; }
    function setValue(ctxStack, key, value) {
        current(ctxStack)[key] = value;
        return value;
    }
    function applyStreamValue(key, index) {
        return function (ctxStack, values) {
            setValue(ctxStack, key, values[index]);
        };
    }
    function constantValue(key, value) {
        return function (ctxStack) {
            setValue(ctxStack, key, value);
        };
    }
    function mkContext(template) {
        return template instanceof Array ? [] : {};
    }
    function pushContext(key, value) {
        return function (ctxStack) {
            var newContext = mkContext(value);
            setValue(ctxStack, key, newContext);
            ctxStack.push(newContext);
        };
    }
    function compile(key, value) {
        if (abstractions_1.isObservable(value)) {
            if (value instanceof abstractions_1.Property || value instanceof abstractions_1.PropertySeed) {
                observables.push(value);
                funcs.push(applyStreamValue(key, observables.length - 1));
            }
            else {
                throw Error("Unsupported Observable in combineTemplate: " + value);
            }
        }
        else if (containsObservables(value)) {
            var popContext = function (ctxStack) { ctxStack.pop(); };
            funcs.push(pushContext(key, value));
            compileTemplate(value);
            funcs.push(popContext);
        }
        else {
            funcs.push(constantValue(key, value));
        }
    }
    function combinator(values) {
        var rootContext = mkContext(template);
        var ctxStack = [rootContext];
        for (var i = 0, f; i < funcs.length; i++) {
            f = funcs[i];
            f(ctxStack, values);
        }
        return rootContext;
    }
    function compileTemplate(template) { each(template, compile); }
    var funcs = [];
    var observables = [];
    var resultProperty = containsObservables(template)
        ? (compileTemplate(template), map_1.map(combine_1.combineAsArray(observables), combinator))
        : property_1.constant(template);
    return util_1.rename("combineTemplate(..)", resultProperty);
}
exports.combineTemplate = combineTemplate;
function containsObservables(value) {
    if (abstractions_1.isObservable(value)) {
        return true;
    }
    else if (value && (value.constructor == Object || value.constructor == Array)) {
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                var child = value[key];
                if (containsObservables(child))
                    return true;
            }
        }
    }
}
function each(xs, f) {
    for (var key in xs) {
        if (Object.prototype.hasOwnProperty.call(xs, key)) {
            var value = xs[key];
            f(key, value);
        }
    }
}
exports.each = each;
//# sourceMappingURL=combinetemplate.js.map