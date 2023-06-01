const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const { OK_LBL } = require("../../../src/constants/messages");

const EventStatsService = rewire("../../../src/services/events/EventStatsService");


describe("Event stats service", () => {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        const setErrorResponseStub = sinon.stub().returns({
            "error": "error"
        });

        EventStatsService.__set__({
            "setOkResponse": setOkResponseStub,

            "setErrorResponse": setErrorResponseStub,

            "logInfo": sinon.stub()
        });

        req = {
            body: {
            },
            headers: {
                authorization: ""
            }
        };

        res = {
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Get event status stats", async () => {
        req.query = {
            start: "2022-05-31",

            end: "2023-05-31"
        };

        const findAllStub = sinon.stub().returns([{
            "state": {
                "name": "Publicado"
            }
        }]);

        EventStatsService.__set__({
            "findAll": findAllStub
        });

        const result = await EventStatsService.getEventStatusStats(req, res);

        console.log(result);

        assert(OK_LBL === result.message);
    });
})