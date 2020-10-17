"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyScopeMaybe = exports.applyScope = void 0;
var abstractions_1 = require("./abstractions");
var atom_1 = require("./atom");
var eventstream_1 = require("./eventstream");
var property_1 = require("./property");
function applyScope(scope, seed) {
    if (seed instanceof abstractions_1.EventStreamSeed || seed instanceof abstractions_1.EventStream) {
        return new eventstream_1.SeedToStream(seed, scope);
    }
    else if (seed instanceof abstractions_1.AtomSeed || seed instanceof abstractions_1.Atom) {
        return new atom_1.StatefulDependentAtom(seed, scope);
    }
    else if (seed instanceof abstractions_1.PropertySeed || seed instanceof abstractions_1.Property) {
        return new property_1.StatefulProperty(seed, scope);
    }
    throw Error("Unknown seed: " + seed);
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
//# sourceMappingURL=applyscope.js.map