const rewire = require("rewire");

const QueryHelper = rewire("../../src/helpers/QueryHelper");

const assert = require("assert");

const { ModelMock } = require("../mocks/ModelMock");

describe("Query helper", () => {
    it("Find one wrapper",  async () => {
        const result = await QueryHelper.findOne(new ModelMock(), [], []);

        assert(result.length === 0);
    });

    it("Find all wrapper",  async () => {
        const result = await QueryHelper.findAll(new ModelMock(), [], []);

        assert(result.length === 0);
    });

    it("Crete wrapper",  async () => {
        const result = await QueryHelper.create(new ModelMock(), [], []);

        assert(result.length === 0);
    });

    it("Update wrapper",  async () => {
        const result = await QueryHelper.update(new ModelMock(), [], []);

        assert(result.length === 0);
    });

    it("Destroy wrapper",  async () => {
        const result = await QueryHelper.destroy(new ModelMock(), [], []);

        assert(result.length === 0);
    });
})