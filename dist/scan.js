"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
function scan(initial, fn, scope) {
    return function (seed) {
        var source = seed.consume();
        var current = initial;
        return applyscope_1.applyScopeMaybe(new abstractions_1.PropertySeed(source + ".scan(fn)", function () { return initial; }, function (observer) {
            var unsub = source.subscribe(function (event) {
                if (abstractions_1.isValue(event)) {
                    current = fn(current, event.value);
                    observer(abstractions_1.valueEvent(current));
                }
                else {
                    observer(event);
                }
            });
            return unsub;
        }), scope);
    };
}
exports.scan = scan;
//# sourceMappingURL=scan.js.map