"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function scan(stream, initial, fn, scope) {
    return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(stream + ".scan(fn)", function (observer) {
        var current = initial;
        var unsub = stream.subscribe(function (event) {
            if (abstractions_1.isValue(event)) {
                current = fn(current, event.value);
                observer(abstractions_1.valueEvent(current));
            }
            else {
                observer(event);
            }
        });
        return [initial, unsub];
    }), scope);
}
exports.scan = scan;
//# sourceMappingURL=scan.js.map