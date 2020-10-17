"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.checkScope = exports.afterScope = exports.beforeScope = exports.autoScope = exports.createScope = exports.mkScope = exports.globalScope = exports.MutableScope = exports.Scope = void 0;
var Scope = /** @class */ (function () {
    function Scope(fn) {
        this.subscribe = fn;
    }
    return Scope;
}());
exports.Scope = Scope;
var MutableScope = /** @class */ (function (_super) {
    __extends(MutableScope, _super);
    function MutableScope(fn, start, end) {
        var _this = _super.call(this, fn) || this;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    return MutableScope;
}(Scope));
exports.MutableScope = MutableScope;
exports.globalScope = mkScope(function (onIn) {
    onIn();
});
function mkScope(scopeFn) {
    return new Scope(scopeFn);
}
exports.mkScope = mkScope;
function createScope() {
    var started = false;
    var ins = [];
    var outs = [];
    return new MutableScope(function (onIn, dispatcher) {
        var onOut = null;
        if (started) {
            onOut = onIn();
            outs.push(onOut);
        }
        else {
            ins.push(onIn);
        }
    }, function () {
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
    }, function () {
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
    });
}
exports.createScope = createScope;
/**
 *  Subscribe to source when there are observers. Use with care!
 **/
exports.autoScope = mkScope(function (onIn, dispatcher) {
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
});
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