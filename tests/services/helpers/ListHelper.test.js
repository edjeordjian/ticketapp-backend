const assert = require("assert");

const {areAnyUndefined} = require("../../../src/helpers/ListHelper");

describe("ListHelper", function () {
    it("Test areAnyUndefined", function () {
        assert.strictEqual(areAnyUndefined(["", "a"]), true);

        assert.strictEqual(areAnyUndefined(["a", "b"]), false);
    });
});