const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const { OK_LBL } = require("../../../src/constants/messages");

const EventCategoriesService = rewire("../../../src/services/events/EventCategoriesService");


describe("Event categories service", () =>  {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        req = {
            body: {
                email: "a@a.com"
            }
        };

        res = {
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

    it("Get event types", async () => {
        req.query = {
            eventId: "1"
        };

        const findAllStub = sinon.stub().resolves([]);

        EventCategoriesService.__set__({
            "findAll": findAllStub
        });

        const getSerializedEventType = sinon.stub().resolves({});

        EventCategoriesService.__set__({
            "getSerializedEventType": getSerializedEventType
        });

        const response = await EventCategoriesService.handleGetTypes(req, res);

        assert(OK_LBL === response.message);
    });

    it("Get reports categories", async () => {
        req.query = {
            eventId: "1"
        };

        const findAllStub = sinon.stub().resolves([]);

        EventCategoriesService.__set__({
            "findAll": findAllStub
        });

        const getSerializedEventType = sinon.stub().resolves({});

        EventCategoriesService.__set__({
            "getSerializedEventType": getSerializedEventType
        });

        const response = await EventCategoriesService.getReportCategories(req, res);

        assert(OK_LBL === response.message);
    });
});
