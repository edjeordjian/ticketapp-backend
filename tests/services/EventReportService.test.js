const assert = require("assert");

const sinon = require("sinon");

const rewire = require("rewire");

const EventReportService = rewire("../../src/services/events/EventReportService");

describe("Event report service", () => {
    let req, res;

    const setErrorResponseStub = sinon.stub().returns({
        "error": "Ok"
    });

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        EventReportService.__set__({
            "setOkResponse": setOkResponseStub,

            "setUnexpectedErrorResponse": setErrorResponseStub,

            "setErrorResponse": setErrorResponseStub,

            "logInfo": sinon.stub()
        });

        req = {
            body: {
                event_id: "1",
                text: "a",
                categories: [1]
            }
        };

        res = res = {
            status: () => {
                return {
                    json: (a_json) => {
                        return a_json
                    }
                }
            }
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Create event report", () => {
        const eventExistsStub = sinon.stub().returns(true);

        const findOneStub = sinon.stub().returns({});

        const createStub = sinon.stub().returns({
            addReport_category: () => {}
        });

        const getUserIdStub = sinon.stub().returns(1);

        EventReportService.__set__({
            "eventExists": eventExistsStub,

            "findOne": findOneStub,

            "create": createStub,

            "getUserId": getUserIdStub
        });

        assert(EventReportService.handleCreateEventReport(req, res));
    })
})