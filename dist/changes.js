"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changes = void 0;
var abstractions_1 = require("./abstractions");
var eventstream_1 = require("./eventstream");
function changes(property) {
    var desc = property + ".changes";
    var source = property instanceof abstractions_1.Property ? property : property.consume();
    var sub = function (observer) {
        return source.onChange(observer);
    };
    if (property instanceof abstractions_1.Property) {
        return new eventstream_1.StatelessEventStream(desc, sub, property.getScope());
    }
    else {
        return new abstractions_1.EventStreamSeed(desc, sub);
    }
}
exports.changes = changes;
//# sourceMappingURL=changes.js.map