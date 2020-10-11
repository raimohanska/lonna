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
Object.defineProperty(exports, "__esModule", { value: true });
exports.each = exports.combineTemplateS = exports.combineTemplate = void 0;
var abstractions_1 = require("./abstractions");
var combine_1 = require("./combine");
var map_1 = require("./map");
var property_1 = require("./property");
var util_1 = require("./util");
function combineTemplate(template) {
    if (!containsObservables(template))
        return property_1.constant(template);
    var _a = __read(processTemplate(template, function (x) {
        if (x instanceof abstractions_1.Property)
            return x;
        throw Error("Unsupported observable: " + x);
    }), 2), observables = _a[0], combinator = _a[1];
    return util_1.rename("combineTemplate(..)", map_1.map(combine_1.combineAsArray(observables), combinator));
}
exports.combineTemplate = combineTemplate;
function combineTemplateS(template) {
    if (!containsObservables(template))
        return property_1.constant(template);
    var _a = __read(processTemplate(template, function (x) {
        if (x instanceof abstractions_1.Property)
            return property_1.toPropertySeed(x);
        if (x instanceof abstractions_1.PropertySeed)
            return x;
        throw Error("Unsupported observable: " + x);
    }), 2), observables = _a[0], combinator = _a[1];
    return util_1.rename("combineTemplate(..)", map_1.map(combine_1.combineAsArray(observables), combinator));
}
exports.combineTemplateS = combineTemplateS;
function processTemplate(template, mapObservable) {
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
    compileTemplate(template);
    return [observables.map(mapObservable), combinator];
}
function containsObservables(value, match) {
    if (match === void 0) { match = abstractions_1.isObservable; }
    if (match(value)) {
        return true;
    }
    else if (value && (value.constructor == Object || value.constructor == Array)) {
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                var child = value[key];
                if (containsObservables(child, match))
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