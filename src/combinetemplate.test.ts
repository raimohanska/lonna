import { later } from ".";
import { combineTemplate, combineTemplateS } from "./combinetemplate";
import { map } from "./map";
import { constant, toProperty } from "./property";
import { expectPropertyEvents } from "./test-utils";

describe("combineTemplate", function() {
    describe("combines streams and properties according to a template object", () => {
        describe("For PropertySeeds", () => {
            expectPropertyEvents(
                function() {
                   const name = constant({first:"jack", last:"bauer"});
                   const stuff = toProperty(later(1, { key: "value" }), { "key": "initial" });
                   const combined = combineTemplateS({ name, stuff });
                   return combined
                 },
                [
                    { name: { first:"jack", last:"bauer"}, stuff: {key:"initial"}},
                    { name: { first:"jack", last:"bauer"}, stuff: {key:"value"}}
                ])                        
        })

        describe("For Properties", () => {
            expectPropertyEvents(
                function() {
                   const name = constant({first:"jack", last:"bauer"});
                   const combined = combineTemplate({ name });
                   return combined
                 },
                [
                    { name: { first:"jack", last:"bauer"}}
                ])                        
        })        
    });
})

// TODO: more test cases from Bacon