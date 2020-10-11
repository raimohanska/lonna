"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformChanges = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var changes_1 = require("./changes");
var util_1 = require("./util");
function transformChanges(desc, x, transformer, scope) {
    if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
        return util_1.rename(desc, transformer(x)); // Note: stream passed as seed, seems to work...
    }
    else if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.Atom) {
        return applyscope_1.applyScopeMaybe(new abstractions_1.AtomSeed(desc, function () { return x.get(); }, function (observer) {
            return transformer(changes_1.changes(x)).subscribe(observer);
        }, x.set));
    }
    else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
        return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(desc, function () { return x.get(); }, function (observer) {
            return transformer(changes_1.changes(x)).subscribe(observer);
        }));
    }
    else {
        throw Error("Unknown observable " + x);
    }
}
exports.transformChanges = transformChanges;
//# sourceMappingURL=transformchanges.js.map