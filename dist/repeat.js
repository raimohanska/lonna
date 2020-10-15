"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = void 0;
var abstractions_1 = require("./abstractions");
var applyscope_1 = require("./applyscope");
var eventstream_1 = require("./eventstream");
var util_1 = require("./util");
function repeat(generator, scope) {
    var index = 0;
    return applyscope_1.applyScopeMaybe(util_1.rename("repeat(fn)", eventstream_1.fromSubscribe(function (sink) {
        var flag = false;
        var unsub = function () { };
        function handleEvent(event) {
            if (abstractions_1.isEnd(event)) {
                if (!flag) {
                    flag = true;
                }
                else {
                    subscribeNext();
                }
            }
            else {
                sink(event);
            }
        }
        function subscribeNext() {
            var next;
            flag = true;
            while (flag) {
                next = generator(index++);
                flag = false;
                if (next) {
                    unsub = next.consume().subscribe(handleEvent);
                }
                else {
                    sink(abstractions_1.endEvent);
                }
            }
            flag = true;
        }
        subscribeNext();
        return function () { return unsub(); };
    })), scope);
}
exports.repeat = repeat;
//# sourceMappingURL=repeat.js.map