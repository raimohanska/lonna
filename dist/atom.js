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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = exports.view = exports.StatefulDependentAtom = void 0;
var L = __importStar(require("./lens"));
var abstractions_1 = require("./abstractions");
var dispatcher_1 = require("./dispatcher");
var scope_1 = require("./scope");
var RootAtom = /** @class */ (function (_super) {
    __extends(RootAtom, _super);
    function RootAtom(desc, initialValue) {
        var _this = _super.call(this, desc) || this;
        _this._dispatcher = new dispatcher_1.Dispatcher();
        _this._value = initialValue;
        return _this;
    }
    RootAtom.prototype.onChange = function (observer) {
        return this._dispatcher.on("change", observer);
    };
    RootAtom.prototype.get = function () {
        return this._value;
    };
    RootAtom.prototype.set = function (newValue) {
        this._value = newValue;
        this._dispatcher.dispatch("change", abstractions_1.valueEvent(newValue));
    };
    RootAtom.prototype.modify = function (fn) {
        this.set(fn(this._value));
    };
    RootAtom.prototype.getScope = function () {
        return scope_1.globalScope;
    };
    return RootAtom;
}(abstractions_1.Atom));
var LensedAtom = /** @class */ (function (_super) {
    __extends(LensedAtom, _super);
    function LensedAtom(desc, root, view) {
        var _this = _super.call(this, desc) || this;
        _this._root = root;
        _this._lens = view;
        return _this;
    }
    LensedAtom.prototype.get = function () {
        return this._lens.get(this._root.get());
    };
    LensedAtom.prototype.set = function (newValue) {
        this._root.set(this._lens.set(this._root.get(), newValue));
    };
    LensedAtom.prototype.modify = function (fn) {
        var _this = this;
        this._root.modify(function (oldRoot) { return _this._lens.set(oldRoot, fn(_this._lens.get(oldRoot))); });
    };
    LensedAtom.prototype.onChange = function (observer) {
        var _this = this;
        var unsub = this._root.onChange(function (event) {
            if (abstractions_1.isValue(event)) {
                var value = _this._lens.get(event.value);
                if (value !== current) {
                    current = value;
                    observer(abstractions_1.valueEvent(value));
                }
            }
            else {
                observer(event);
            }
        });
        var current = this.get();
        return unsub;
    };
    LensedAtom.prototype.getScope = function () {
        return this._root.getScope();
    };
    return LensedAtom;
}(abstractions_1.Atom));
var DependentAtom = /** @class */ (function (_super) {
    __extends(DependentAtom, _super);
    function DependentAtom(desc, input, set) {
        var _this = _super.call(this, desc) || this;
        _this._input = input;
        _this.set = set;
        return _this;
    }
    DependentAtom.prototype.onChange = function (observer) {
        return this._input.onChange(observer);
    };
    DependentAtom.prototype.get = function () {
        return this._input.get();
    };
    DependentAtom.prototype.modify = function (fn) {
        this.set(fn(this.get()));
    };
    DependentAtom.prototype.getScope = function () {
        return this._input.getScope();
    };
    return DependentAtom;
}(abstractions_1.Atom));
var StatefulDependentAtom = /** @class */ (function (_super) {
    __extends(StatefulDependentAtom, _super);
    function StatefulDependentAtom(seed, scope) {
        var _this = _super.call(this, seed.desc) || this;
        _this._dispatcher = new dispatcher_1.Dispatcher();
        _this._value = scope_1.beforeScope;
        _this._scope = scope;
        _this.set = seed.set;
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
            var unsub = seed.onChange(meAsObserver);
            _this._value = seed.get();
            return function () {
                _this._value = scope_1.afterScope;
                unsub();
            };
        }, _this._dispatcher);
        return _this;
    }
    StatefulDependentAtom.prototype.get = function () {
        return scope_1.checkScope(this, this._value);
    };
    StatefulDependentAtom.prototype.modify = function (fn) {
        this.set(fn(this.get()));
    };
    StatefulDependentAtom.prototype.onChange = function (observer) {
        return this._dispatcher.on("change", observer);
    };
    StatefulDependentAtom.prototype.getScope = function () {
        return this._scope;
    };
    return StatefulDependentAtom;
}(abstractions_1.Atom));
exports.StatefulDependentAtom = StatefulDependentAtom;
function view(atom, view) {
    if (typeof view === "string") {
        return new LensedAtom(atom + "." + view, atom, L.prop(view));
    }
    else if (typeof view === "number") {
        return new LensedAtom(atom + ("[" + view + "]"), atom, L.item(view));
    }
    else {
        return new LensedAtom(atom + ".view(..)", atom, view);
    }
}
exports.view = view;
function atom(x, y) {
    if (arguments.length == 1) {
        return new RootAtom("RootAtom", x);
    }
    else {
        return new DependentAtom("DependentAtom(" + x + ")", x, y);
    }
}
exports.atom = atom;
//# sourceMappingURL=atom.js.map