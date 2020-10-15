"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
exports.update = void 0;
var abstractions_1 = require("./abstractions");
var merge_1 = require("./merge");
var scan_1 = require("./scan");
var map_1 = require("./map");
var applyscope_1 = require("./applyscope");
var tostring_1 = require("./tostring");
var util_1 = require("./util");
function update() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scope;
    var initial;
    var patterns;
    if (args[0] instanceof Function) {
        scope = args[0];
        initial = args[1];
        patterns = args.slice(2);
    }
    else {
        scope = undefined;
        initial = args[0];
        patterns = args.slice(1);
    }
    var mutators = patterns.map(function (pattern) {
        var e_1, _a;
        if (pattern.length < 2)
            throw Error("Illegal pattern " + pattern + ", length must be >= 2");
        var sources = pattern.slice(0, pattern.length - 1);
        var trigger = sources[0];
        if (!(trigger instanceof abstractions_1.EventStream || trigger instanceof abstractions_1.EventStreamSeed))
            throw Error("Illegal pattern " + pattern + ", must contain one EventStream");
        var properties = sources.slice(1);
        try {
            for (var properties_1 = __values(properties), properties_1_1 = properties_1.next(); !properties_1_1.done; properties_1_1 = properties_1.next()) {
                var prop = properties_1_1.value;
                if (!(prop instanceof abstractions_1.Property))
                    throw Error("Illegal pattern " + pattern + ". After one EventStream the rest on the observables must be Properties");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (properties_1_1 && !properties_1_1.done && (_a = properties_1.return)) _a.call(properties_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var combinator = pattern[pattern.length - 1];
        if (!(combinator instanceof Function)) {
            var constantValue_1 = combinator;
            combinator = function () { return constantValue_1; };
        }
        return map_1.map(trigger, (function (v1) {
            return function (state) {
                var propValues = properties.map(function (p) { return p.get(); });
                return combinator.apply(void 0, __spread([state, v1], propValues));
            };
        }));
    });
    return util_1.rename("update(" + tostring_1.toString(initial) + "," + tostring_1.toString(patterns) + ")", applyscope_1.applyScopeMaybe(scan_1.scan(merge_1.merge(mutators), initial, function (state, mutation) { return mutation(state); }), scope));
}
exports.update = update;
//# sourceMappingURL=update.js.map