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
Object.defineProperty(exports, "__esModule", { value: true });
exports.constant = exports.toPropertySeed = exports.toProperty = exports.StatefulProperty = exports.StatelessProperty = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var dispatcher_1 = require("./dispatcher");
var never_1 = require("./never");
var scope_1 = require("./scope");
var util_1 = require("./util");
var StatelessProperty = /** @class */ (function (_super) {
    __extends(StatelessProperty, _super);
    function StatelessProperty(desc, get, onChange, scope) {
        var _this = _super.call(this, desc) || this;
        _this.get = get;
        _this._onChange = onChange;
        _this._scope = scope;
        return _this;
    }
    StatelessProperty.prototype.onChange = function (observer) {
        var unsub = this._onChange(function (event) {
            if (abstractions_1.isValue(event)) {
                if (event.value !== current) {
                    current = event.value;
                    observer(event);
                }
            }
            else {
                observer(event);
            }
        });
        var current = this.get();
        return unsub;
    };
    StatelessProperty.prototype.getScope = function () {
        return this._scope;
    };
    return StatelessProperty;
}(abstractions_1.Property));
exports.StatelessProperty = StatelessProperty;
var StatefulProperty = /** @class */ (function (_super) {
    __extends(StatefulProperty, _super);
    function StatefulProperty(seed, scope) {
        var _this = _super.call(this, seed.desc) || this;
        _this._dispatcher = new dispatcher_1.Dispatcher();
        _this._value = scope_1.beforeScope;
        _this._scope = scope;
        var meAsObserver = function (event) {
            if (abstractions_1.isValue(event)) {
                if (event.value !== _this._value) {
                    _this._value = event.value;
                    _this._dispatcher.dispatch("change", event);
                }
            }
            else {
                _this._dispatcher.dispatch("change", event);
            }
        };
        scope(function () {
            var source = seed.consume();
            var unsub = source.onChange(meAsObserver);
            _this._value = source.get();
            return function () {
                _this._value = scope_1.afterScope;
                unsub();
            };
        }, _this._dispatcher);
        return _this;
    }
    StatefulProperty.prototype.onChange = function (observer) {
        return this._dispatcher.on("change", observer);
    };
    StatefulProperty.prototype.get = function () {
        return scope_1.checkScope(this, this._value);
    };
    StatefulProperty.prototype.getScope = function () {
        return this._scope;
    };
    return StatefulProperty;
}(abstractions_1.Property));
exports.StatefulProperty = StatefulProperty;
function toProperty(seed, initial, scope) {
    var source = seed.consume();
    return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(seed + (".toProperty(" + initial + ")"), function () { return initial; }, function (observer) {
        return source.subscribe(observer);
    }), scope);
}
exports.toProperty = toProperty;
function toPropertySeed(property) {
    if (property instanceof abstractions_1.PropertySeed) {
        return property;
    }
    return new abstractions_1.PropertySeed(property.desc, property.get.bind(property), property.onChange.bind(property));
}
exports.toPropertySeed = toPropertySeed;
function constant(value) {
    return util_1.rename("constant(" + value + ")", toProperty(never_1.never(), value, scope_1.globalScope));
}
exports.constant = constant;
//# sourceMappingURL=property.js.map