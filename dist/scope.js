(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./dispatcher"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkScope = exports.afterScope = exports.beforeScope = exports.autoScope = exports.scope = exports.globalScope = void 0;
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
                scopeDispatcher.dispatch("in", undefined);
            },
            end: function () {
                started = false;
                scopeDispatcher.dispatch("out", undefined);
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
});
//# sourceMappingURL=scope.js.map