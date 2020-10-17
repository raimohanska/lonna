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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScope = exports.afterScope = exports.beforeScope = exports.autoScope = exports.createScope = exports.globalScope = void 0;
exports.globalScope = function (onIn, dispatcher) {
    onIn();
};
function createScope() {
    var started = false;
    var ins = [];
    var outs = [];
    return {
        apply: function (onIn, dispatcher) {
            var onOut = null;
            if (started) {
                onOut = onIn();
                outs.push(onOut);
            }
            else {
                ins.push(onIn);
            }
        },
        start: function () {
            var e_1, _a;
            started = true;
            try {
                for (var ins_1 = __values(ins), ins_1_1 = ins_1.next(); !ins_1_1.done; ins_1_1 = ins_1.next()) {
                    var i = ins_1_1.value;
                    outs.push(i());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ins_1_1 && !ins_1_1.done && (_a = ins_1.return)) _a.call(ins_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ins.splice(0);
        },
        end: function () {
            var e_2, _a;
            started = false;
            try {
                for (var outs_1 = __values(outs), outs_1_1 = outs_1.next(); !outs_1_1.done; outs_1_1 = outs_1.next()) {
                    var o = outs_1_1.value;
                    o();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (outs_1_1 && !outs_1_1.done && (_a = outs_1.return)) _a.call(outs_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            outs.splice(0);
        }
    };
}
exports.createScope = createScope;
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