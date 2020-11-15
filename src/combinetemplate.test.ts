import { combineTemplate, combineTemplateS, constant, later, toProperty } from "./index";
import { expectPropertyEvents } from "./test-utils";

describe("combineTemplate", function() {
    describe("combines streams and properties according to a template object", () => {
        describe("For PropertySeeds", () => {
            expectPropertyEvents(
                function() {
                   const name = constant({first:"jack", last:"bauer"});
                   const stuff = toProperty({ "key": "initial" })(later(1, { key: "value" }));
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