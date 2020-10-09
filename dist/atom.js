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
exports.atom = exports.view = exports.StatefulDependentAtom = void 0;
var L = __importStar(require("./lens"));
var abstractions_1 = require("./abstractions");
var dispatcher_1 = require("./dispatcher");
var scope_1 = require("./scope");
var util_1 = require("./util");
var RootAtom = /** @class */ (function (_super) {
    __extends(RootAtom, _super);
    function RootAtom(desc, initialValue) {
        var _this = _super.call(this, desc) || this;
        _this.dispatcher = new dispatcher_1.Dispatcher();
        _this.value = initialValue;
        return _this;
    }
    RootAtom.prototype.on = function (event, observer) {
        var unsub = this.dispatcher.on(event, observer);
        if (event === "value") {
            observer(this.get());
        }
        return unsub;
    };
    RootAtom.prototype.get = function () {
        return this.value;
    };
    RootAtom.prototype.set = function (newValue) {
        this.value = newValue;
        this.dispatcher.dispatch("value", newValue);
        this.dispatcher.dispatch("change", newValue);
    };
    RootAtom.prototype.modify = function (fn) {
        this.set(fn(this.value));
    };
    RootAtom.prototype.scope = function () {
        return scope_1.globalScope;
    };
    return RootAtom;
}(abstractions_1.Atom));
var LensedAtom = /** @class */ (function (_super) {
    __extends(LensedAtom, _super);
    function LensedAtom(desc, root, view) {
        var _this = _super.call(this, desc) || this;
        _this.root = root;
        _this.lens = view;
        return _this;
    }
    LensedAtom.prototype.get = function () {
        return this.lens.get(this.root.get());
    };
    LensedAtom.prototype.set = function (newValue) {
        this.root.set(this.lens.set(this.root.get(), newValue));
    };
    LensedAtom.prototype.modify = function (fn) {
        var _this = this;
        this.root.modify(function (oldRoot) { return _this.lens.set(oldRoot, fn(_this.lens.get(oldRoot))); });
    };
    LensedAtom.prototype.on = function (event, observer) {
        var _this = this;
        var unsub = this.root.on("change", function (newRoot) {
            statefulObserver(_this.lens.get(newRoot));
        });
        var initial = this.get();
        var statefulObserver = util_1.duplicateSkippingObserver(initial, observer);
        if (event === "value") {
            observer(initial);
        }
        return unsub;
    };
    LensedAtom.prototype.scope = function () {
        return this.root.scope();
    };
    return LensedAtom;
}(abstractions_1.Atom));
var DependentAtom = /** @class */ (function (_super) {
    __extends(DependentAtom, _super);
    function DependentAtom(desc, input, onChange) {
        var _this = _super.call(this, desc) || this;
        _this.input = input;
        _this.onChange = onChange;
        return _this;
    }
    DependentAtom.prototype.get = function () {
        return this.input.get();
    };
    DependentAtom.prototype.set = function (newValue) {
        this.onChange(newValue);
    };
    DependentAtom.prototype.modify = function (fn) {
        this.set(fn(this.get()));
    };
    DependentAtom.prototype.on = function (event, observer) {
        return this.input.on(event, observer);
    };
    DependentAtom.prototype.scope = function () {
        return this.input.scope();
    };
    return DependentAtom;
}(abstractions_1.Atom));
var StatefulDependentAtom = /** @class */ (function (_super) {
    __extends(StatefulDependentAtom, _super);
    function StatefulDependentAtom(seed, scope) {
        var _this = _super.call(this, seed.desc) || this;
        _this.dispatcher = new dispatcher_1.Dispatcher();
        _this.value = scope_1.beforeScope;
        _this._scope = scope;
        _this.set = seed.set;
        var meAsObserver = function (newValue) {
            _this.value = newValue;
            _this.dispatcher.dispatch("change", newValue);
            _this.dispatcher.dispatch("value", newValue);
        };
        scope(function () {
            var _a = __read(seed.subscribe(meAsObserver), 2), newValue = _a[0], unsub = _a[1];
            _this.value = newValue;
            return function () {
                _this.value = scope_1.afterScope;
                unsub();
            };
        }, _this.dispatcher);
        return _this;
    }
    StatefulDependentAtom.prototype.get = function () {
        return scope_1.checkScope(this, this.value);
    };
    StatefulDependentAtom.prototype.modify = function (fn) {
        this.set(fn(this.get()));
    };
    StatefulDependentAtom.prototype.on = function (event, observer) {
        var unsub = this.dispatcher.on(event, observer);
        if (event === "value") {
            observer(this.get());
        }
        return unsub;
    };
    StatefulDependentAtom.prototype.scope = function () {
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