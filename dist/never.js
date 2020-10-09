"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.never = void 0;
var eventstream_1 = require("./eventstream");
var scope_1 = require("./scope");
function never() {
    return new eventstream_1.StatefulEventStream("never", scope_1.globalScope);
}
exports.never = never;
//# sourceMappingURL=never.js.map