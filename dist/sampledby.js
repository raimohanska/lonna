"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampledBy = void 0;
var map_1 = require("./map");
function sampledBy(prop, sampler) {
    return map_1.map(sampler, prop);
}
exports.sampledBy = sampledBy;
//# sourceMappingURL=sampledby.js.map