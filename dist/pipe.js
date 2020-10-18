"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
function pipe(x) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    for (var i = 0, n = fns.length; i < n; i++) {
        x = fns[i](x);
    }
    return x;
}
exports.pipe = pipe;
//# sourceMappingURL=pipe.js.map