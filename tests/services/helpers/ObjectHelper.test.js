const { objDeepCopy, isEmpty } = require("../../../src/services/helpers/ObjectHelper");

const assert = require("assert");

describe("Object helper", () => {
    it("objDeepCopy", () => {
        assert("a" === objDeepCopy("a"));
    });

    it("isEmpty", () => {
        assert(isEmpty({}))
    });

    it("is not empty", () => {
        assert(! isEmpty({
            a: "A"
        }))
    });
});
