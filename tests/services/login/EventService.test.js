const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const {OK_LBL} = require("../../../src/constants/messages");

const EventService = rewire("../../../src/services/events/EventService");


describe("EventService", function() {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
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

    it("Get every event", async () => {
        req.query = {

        };

        const findAllStub = sinon.stub().resolves([]);

        EventService.__set__({
            "findAll": findAllStub
        });

        const response = await EventService.handleSearch(req, res);

        assert(OK_LBL === response.message);
    });

    it("Search event by name", async () => {
        req.query = {
            value: "Evento"
        };

        const findAllStub = sinon.stub().resolves([]);

        EventService.__set__({
            "findAll": findAllStub
        });

        const response = await EventService.handleSearch(req, res);

        assert(OK_LBL === response.message);
    });

    it("Cannot find event by id without query param", async () => {
        req.query = {

        };

        const response = await EventService.handleGet(req, res);

        assert("error" === response.error);
    });

    it("Find event by id", async () => {
        req.query = {
            eventId: "1"
        };

        const findAllStub = sinon.stub().resolves({});

        EventService.__set__({
            "findAll": findAllStub
        });

        const getSerializedEventStub = sinon.stub().resolves({});

        EventService.__set__({
            "getSerializedEvent": getSerializedEventStub
        });

        const response = await EventService.handleGet(req, res);

        assert(OK_LBL === response.message);
    });

    it("Get types", async () => {
        req.query = {
            eventId: "1"
        };

        const findAllStub = sinon.stub().resolves([]);

        EventService.__set__({
            "findAll": findAllStub
        });

        const getSerializedEventType = sinon.stub().resolves({});

        EventService.__set__({
            "getSerializedEventType": getSerializedEventType
        });

        const response = await EventService.handleGetTypes(req, res);

        assert(OK_LBL === response.message);
    });

    it("Cannot sign up to an existing event", async () => {
        const findOneStub = sinon.stub().resolves([]);

        EventService.__set__({
            "findOne": findOneStub
        });

        const getAttendanceIdStub = sinon.stub().resolves([]);

        EventService.__set__({
            "getAttendanceId": getAttendanceIdStub
        });

        const response = await EventService.handleEventSignUp(req, res);

        assert("error" === response.error);
    });
});
