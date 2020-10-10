"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScope = exports.afterScope = exports.beforeScope = exports.autoScope = exports.scope = exports.globalScope = void 0;
var abstractions_1 = require("./abstractions");
var dispatcher_1 = require("./dispatcher");
exports.globalScope = function (onIn, dispatcher) {
    onIn();
};
function scope() {
    var started = false;
    var scopeDispatcher = new dispatcher_1.Dispatcher();
    return {
        apply: function (onIn, dispatcher) {
            var unsub = null;
            if (started) {
                unsub = onIn();
            }
            else {
                scopeDispatcher.on("in", onIn);
            }
            scopeDispatcher.on("out", function () { return unsub(); });
        },
        start: function () {
            started = true;
            scopeDispatcher.dispatch("in", abstractions_1.valueEvent(undefined));
        },
        end: function () {
            started = false;
            scopeDispatcher.dispatch("out", abstractions_1.valueEvent(undefined));
        }
    };
}
exports.scope = scope;
/**
 *  Subscribe to source when there are observers. Use with care!
 **/
exports.autoScope = function (onIn, dispatcher) {
    var unsub = null;
    if (dispatcher.hasObservers()) {
        unsub = onIn();
    }
    var ended = false;
    dispatcher.onObserverCount(function (count) {
        if (count > 0) {
            if (ended)
                throw new Error("autoScope reactivation attempted");
            unsub = onIn();
        }
        else {
            ended = true;
            unsub();
        }
    });
};
exports.beforeScope = {};
exports.afterScope = {};
function checkScope(thing, value) {
    if (value === exports.beforeScope)
        throw Error(thing + " not yet in scope");
    if (value === exports.afterScope)
        throw Error(thing + " not yet in scope");
    return value;
}
exports.checkScope = checkScope;
//# sourceMappingURL=scope.js.map