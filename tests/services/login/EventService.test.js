const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const {OK_LBL} = require("../../../src/constants/messages");

const EventService = rewire("../../../src/services/events/EventService");


describe("EventService", function() {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "status": "Ok"
        });

        const setErrorResponseStub = sinon.stub().returns({
           "error": "error"
        });

        EventService.__set__({
            "setOkResponse": setOkResponseStub,

            "setErrorResponse": setErrorResponseStub,

            "logInfo": sinon.stub()
        });

        req = {
            body: {
            }
        };

        res = {
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Cannot create event if name already exists", async () => {
        const findOneStub = sinon.stub().resolves({
            "name": "name"
        });

        EventService.__set__({
            "findOne": findOneStub
        });

        const response = await EventService.handleCreate(req, res);

        assert("error" === response.error);
    });
});
