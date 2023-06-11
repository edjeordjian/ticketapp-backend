const rewire = require("rewire");

const sinon = require("sinon");

const assert = require("assert");

const EventStateService = rewire("../../../src/services/events/EventStateService");

describe("Event state service", () => {
    it("Event state error", async () => {
        const findOneStub = sinon.stub().resolves({
            error: "error"
        });

        EventStateService.__set__({
            "findOne": findOneStub
        });

        const result = await EventStateService.getStateId("name");

        assert(result.error)
    });

    it("Event state", async () => {
        const findOneStub = sinon.stub().resolves({
            id: 1
        });

        EventStateService.__set__({
            "findOne": findOneStub
        });

        const result = await EventStateService.getStateId("name");

        assert(result === 1)
    });
})