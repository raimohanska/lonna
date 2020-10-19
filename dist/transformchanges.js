"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformChanges = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var changes_1 = require("./changes");
var util_1 = require("./util");
function transformChanges(descSuffix, transformer, scope) {
    return function (x) {
        var desc = x + "." + descSuffix;
        var r;
        if (x instanceof abstractions_1.EventStream || x instanceof abstractions_1.EventStreamSeed) {
            r = util_1.rename(desc, transformer(x)); // TODO: stream coerced into stream seed due to improper typing
        }
        else if (x instanceof abstractions_1.Atom || x instanceof abstractions_1.AtomSeed) {
            var source_1 = x instanceof abstractions_1.Property ? x : x.consume();
            r = new abstractions_1.AtomSeed(desc, function () { return source_1.get(); }, function (observer) {
                return transformer(changes_1.changes(source_1)).consume().subscribe(observer); // TODO: AtomSource coerced into AtomSeed due to improper typing
            }, source_1.set);
        }
        else if (x instanceof abstractions_1.Property || x instanceof abstractions_1.PropertySeed) {
            var source_2 = x instanceof abstractions_1.Property ? x : x.consume();
            r = new abstractions_1.PropertySeed(desc, function () { return source_2.get(); }, function (observer) {
                return transformer(changes_1.changes(source_2)).consume().subscribe(observer); // TODO: PropertySource coerced into PropertySeed due to improper typing
            });
        }
        else {
            throw Error("Unknown observable " + x);
        }
        return applyscope_1.applyScopeMaybe(r, scope);
    };
}
exports.transformChanges = transformChanges;
//# sourceMappingURL=transformchanges.js.map