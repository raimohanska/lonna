"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = void 0;
var property_1 = require("./property");
function combine() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var properties = args.slice(0, args.length - 1);
    var f = args[args.length - 1];
    return new property_1.DerivedProperty("combine(" + properties + ", fn)", properties, f);
}
exports.combine = combine;
;
//# sourceMappingURL=combine.js.map