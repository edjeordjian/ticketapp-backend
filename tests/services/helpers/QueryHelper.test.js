const rewire = require("rewire");

const QueryHelper = rewire("../../../src/services/helpers/QueryHelper");

const assert = require("assert");

const { ModelMock } = require("../../mocks/ModelMock");

describe("Query helper", () => {
    it("find one wrapper",  async () => {
        const result = await QueryHelper.findOne(new ModelMock(), [], []);

        assert(result.length === 0);
    })
})