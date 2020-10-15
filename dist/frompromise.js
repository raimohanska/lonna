"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromise = void 0;
var abstractions_1 = require("./abstractions");
var map_1 = require("./map");
var property_1 = require("./property");
var scope_1 = require("./scope");
var tostring_1 = require("./tostring");
function fromPromise(promise, mapper) {
    var currentState = { state: "pending" };
    promise.then(function (value) {
        currentState = { state: "resolved", value: value };
    }, function (error) {
        currentState = { state: "rejected", error: error };
    });
    var onChange = function (o) {
        var observer = o;
        function update(state) {
            if (observer) {
                observer(abstractions_1.valueEvent(state));
                observer(abstractions_1.endEvent);
            }
        }
        if (currentState.state === "pending") {
            promise.then(function (value) {
                console.log("Update observer", value);
                update({ state: "resolved", value: value });
            }, function (error) {
                update({ state: "rejected", error: error });
            });
        }
        else {
            observer(abstractions_1.endEvent);
        }
        return function () {
            observer = null;
        };
    };
    var get = function () { return currentState; };
    var property = new property_1.StatelessProperty("fromPromise(" + tostring_1.toString(promise) + ")", get, onChange, scope_1.globalScope);
    if (mapper) {
        return map_1.map(property, function (state) {
            if (state.state === "pending")
                return mapper[0]();
            if (state.state === "resolved")
                return mapper[1](state.value);
            return mapper[2](state.error);
        });
    }
    return property;
}
exports.fromPromise = fromPromise;
//# sourceMappingURL=frompromise.js.map