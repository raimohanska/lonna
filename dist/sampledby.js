"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampledBy = void 0;
var map_1 = require("./map");
function sampledBy(sampler) {
    return function (prop) { return map_1.map(prop)(sampler); };
}
exports.sampledBy = sampledBy;
//# sourceMappingURL=sampledby.js.map