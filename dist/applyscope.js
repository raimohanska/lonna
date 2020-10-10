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
exports.applyScopeMaybe = exports.applyScope = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var atom_1 = require("./atom");
var property_1 = require("./property");
function applyScope(scope, seed) {
    if (seed instanceof abstractions_1.EventStreamSeed) {
        return new SeedToStream(seed, scope);
    }
    else if (seed instanceof abstractions_1.AtomSeed) {
        return new atom_1.StatefulDependentAtom(seed, scope);
    }
    else if (seed instanceof abstractions_1.PropertySeed) {
        return new property_1.StatefulProperty(seed, scope);
    }
    throw Error("Unknown seed");
}
exports.applyScope = applyScope;
/** @hidden */
function applyScopeMaybe(seed, scope) {
    if (scope !== undefined) {
        return applyScope(scope, seed);
    }
    return seed;
}
exports.applyScopeMaybe = applyScopeMaybe;
var SeedToStream = /** @class */ (function (_super) {
    __extends(SeedToStream, _super);
    function SeedToStream(seed, scope) {
        var _this = _super.call(this, seed.desc, scope) || this;
        scope(function () { return seed.subscribe(function (v) { return _this.dispatcher.dispatch("value", v); }); }, _this.dispatcher);
        return _this;
    }
    return SeedToStream;
}(eventstream_1.StatefulEventStream));
//# sourceMappingURL=applyscope.js.map