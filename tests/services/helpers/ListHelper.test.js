const assert = require("assert");

const {areAnyUndefined} = require("../../../src/services/helpers/ListHelper");

describe("ListHelper", function () {
    it("Test areAnyUndefined", function () {
        assert.strictEqual(areAnyUndefined(["", "a"]), true);

        assert.strictEqual(areAnyUndefined(["a", "b"]), false);
    });
});