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
exports.constant = exports.toProperty = exports.toPropertySeed = exports.StatefulProperty = exports.DerivedProperty = exports.StatefulPropertyBase = void 0;
var abstractions_1 = require("./abstractions");
var dispatcher_1 = require("./dispatcher");
var never_1 = require("./never");
var scope_1 = require("./scope");
var util_1 = require("./util");
var StatefulPropertyBase = /** @class */ (function (_super) {
    __extends(StatefulPropertyBase, _super);
    function StatefulPropertyBase(desc) {
        var _this = _super.call(this, desc) || this;
        _this.dispatcher = new dispatcher_1.Dispatcher();
        return _this;
    }
    StatefulPropertyBase.prototype.on = function (event, observer) {
        var unsub = this.dispatcher.on(event, observer);
        if (event === "value") {
            observer(this.get());
        }
        return unsub;
    };
    return StatefulPropertyBase;
}(abstractions_1.Property));
exports.StatefulPropertyBase = StatefulPropertyBase;
var DerivedProperty = /** @class */ (function (_super) {
    __extends(DerivedProperty, _super);
    function DerivedProperty(desc, sources, combinator) {
        var _this = _super.call(this, desc) || this;
        _this.sources = sources;
        _this.combinator = combinator;
        return _this;
    }
    DerivedProperty.prototype.get = function () {
        return this.combinator.apply(this, __spread(this.getCurrentArray()));
    };
    DerivedProperty.prototype.getCurrentArray = function () {
        return this.sources.map(function (s) { return s.get(); });
    };
    DerivedProperty.prototype.on = function (event, observer) {
        var _this = this;
        var unsubs = this.sources.map(function (src, i) {
            return src.on("change", function (newValue) {
                currentArray[i] = newValue;
                statefulObserver(_this.combinator.apply(_this, __spread(currentArray)));
            });
        });
        var currentArray = this.getCurrentArray();
        var initial = this.combinator.apply(this, __spread(currentArray));
        var statefulObserver = util_1.duplicateSkippingObserver(initial, observer);
        if (event === "value") {
            observer(initial);
        }
        return function () {
            unsubs.forEach(function (f) { return f(); });
        };
    };
    DerivedProperty.prototype.scope = function () {
        if (this.sources.length === 0)
            return scope_1.globalScope;
        return this.sources[0].scope();
    };
    return DerivedProperty;
}(abstractions_1.Property));
exports.DerivedProperty = DerivedProperty;
var StatefulProperty = /** @class */ (function (_super) {
    __extends(StatefulProperty, _super);
    function StatefulProperty(seed, scope) {
        var _this = _super.call(this, seed.desc) || this;
        _this.value = scope_1.beforeScope;
        _this._scope = scope;
        var meAsObserver = function (newValue) {
            if (newValue !== _this.value) {
                _this.value = newValue;
                _this.dispatcher.dispatch("change", newValue);
                _this.dispatcher.dispatch("value", newValue);
            }
        };
        scope(function () {
            var _a = __read(seed.subscribe(meAsObserver), 2), newValue = _a[0], unsub = _a[1];
            _this.value = newValue;
            return unsub;
        }, _this.dispatcher);
        return _this;
    }
    StatefulProperty.prototype.get = function () {
        return scope_1.checkScope(this, this.value);
    };
    StatefulProperty.prototype.scope = function () {
        return this._scope;
    };
    return StatefulProperty;
}(StatefulPropertyBase));
exports.StatefulProperty = StatefulProperty;
function toPropertySeed(stream, initial) {
    var forEach = function (observer) {
        return [initial, stream.forEach(observer)];
    };
    return new abstractions_1.PropertySeed(stream + (".toProperty(" + initial + ")"), forEach);
}
exports.toPropertySeed = toPropertySeed;
function toProperty(stream, initial, scope) {
    return new StatefulProperty(toPropertySeed(stream, initial), scope);
}
exports.toProperty = toProperty;
function constant(value) {
    return toProperty(never_1.never(), value, scope_1.globalScope);
}
exports.constant = constant;
//# sourceMappingURL=property.js.map