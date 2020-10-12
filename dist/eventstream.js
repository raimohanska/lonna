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
exports.fromSubscribe = exports.SeedToStream = exports.StatelessEventStream = exports.StatefulEventStream = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var dispatcher_1 = require("./dispatcher");
// Note that we could use a Dispatcher as Bus, except for prototype inheritance of EventStream on the way
var StatefulEventStream = /** @class */ (function (_super) {
    __extends(StatefulEventStream, _super);
    function StatefulEventStream(desc, scope) {
        var _this = _super.call(this, desc) || this;
        _this.dispatcher = new dispatcher_1.Dispatcher();
        _this._scope = scope;
        return _this;
    }
    StatefulEventStream.prototype.subscribe = function (observer) {
        return this.dispatcher.on("value", observer);
    };
    StatefulEventStream.prototype.getScope = function () {
        return this._scope;
    };
    return StatefulEventStream;
}(abstractions_1.EventStream));
exports.StatefulEventStream = StatefulEventStream;
var StatelessEventStream = /** @class */ (function (_super) {
    __extends(StatelessEventStream, _super);
    function StatelessEventStream(desc, subscribe, scope) {
        var _this = _super.call(this, desc) || this;
        _this._scope = scope;
        _this.subscribe = subscribe;
        return _this;
    }
    StatelessEventStream.prototype.getScope = function () {
        return this._scope;
    };
    return StatelessEventStream;
}(abstractions_1.EventStream));
exports.StatelessEventStream = StatelessEventStream;
var SeedToStream = /** @class */ (function (_super) {
    __extends(SeedToStream, _super);
    function SeedToStream(seed, scope) {
        var _this = _super.call(this, seed.desc, scope) || this;
        var source = seed.consume();
        scope(function () { return source.subscribe(function (v) { return _this.dispatcher.dispatch("value", v); }); }, _this.dispatcher);
        return _this;
    }
    return SeedToStream;
}(StatefulEventStream));
exports.SeedToStream = SeedToStream;
function fromSubscribe(subscribe, scope) {
    return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed("fromSubscribe(fn)", subscribe), scope);
}
exports.fromSubscribe = fromSubscribe;
//# sourceMappingURL=eventstream.js.map