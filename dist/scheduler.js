"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setScheduler = exports.getScheduler = exports.defaultScheduler = void 0;
/** @hidden */
exports.defaultScheduler = {
    setTimeout: function (f, d) { return setTimeout(f, d); },
    setInterval: function (f, i) { return setInterval(f, i); },
    clearInterval: function (id) { return clearInterval(id); },
    clearTimeout: function (id) { return clearTimeout(id); },
    now: function () { return new Date().getTime(); }
};
var GlobalScheduler = {
    scheduler: exports.defaultScheduler
};
function getScheduler() {
    return GlobalScheduler.scheduler;
}
exports.getScheduler = getScheduler;
function setScheduler(newScheduler) {
    GlobalScheduler.scheduler = newScheduler;
}
exports.setScheduler = setScheduler;
exports.default = GlobalScheduler;
//# sourceMappingURL=scheduler.js.map