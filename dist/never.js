"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.never = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
var scope_1 = require("./scope");
var util_1 = require("./util");
function never() {
    return new eventstream_1.StatelessEventStream("never", function (observer) {
        observer(abstractions_1.endEvent);
        return util_1.nop;
    }, scope_1.globalScope);
}
exports.never = never;
//# sourceMappingURL=never.js.map