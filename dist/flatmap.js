"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var util_1 = require("./util");
function flatMap(s, fn, scope) {
    if (s instanceof abstractions_1.EventStream) {
        scope = s.getScope();
    }
    return applyscope_1.applyScopeMaybe(new abstractions_1.EventStreamSeed(s + ".flatMap(fn)", function (observer) {
        var children = [];
        var rootEnded = false;
        var unsubThis = s.subscribe(function (event) {
            if (abstractions_1.isValue(event)) {
                var child = fn(event.value);
                var unsubChild_1 = child.subscribe(function (event) {
                    if (abstractions_1.isValue(event)) {
                        observer(event);
                    }
                    else {
                        util_1.remove(children, unsubChild_1);
                        if (children.length === 0 && rootEnded) {
                            observer(abstractions_1.endEvent);
                        }
                    }
                });
                children.push(unsubChild_1);
            }
            else {
                rootEnded = true;
                if (children.length === 0) {
                    observer(abstractions_1.endEvent);
                }
            }
        });
        return function () {
            unsubThis();
            children.forEach(function (f) { return f(); });
        };
    }));
}
exports.flatMap = flatMap;
//# sourceMappingURL=flatmap.js.map