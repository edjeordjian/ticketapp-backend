const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const { EventMock } = require("../mocks/EventMock");

const Event = rewire("../../src/data/model/Events");

const {OK_LBL} = require("../../src/constants/messages");

const EventService = rewire("../../src/services/events/EventService");


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

        const eventIdStub = sinon.stub().resolves(1);

        EventService.__set__({
           "getUserId": eventIdStub
        });

        const response = await EventService.handleSearch(req, res);

        assert(OK_LBL === response.message);
    });

    it("Search event by owner", async () => {
        req.query = {
            owner: "Evento"
        };

        const findAllStub = sinon.stub().resolves([]);

        EventService.__set__({
            "findAll": findAllStub
        });

        const eventIdStub = sinon.stub().resolves(1);

        EventService.__set__({
            "getUserId": eventIdStub
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

        const findOneStub = sinon.stub().resolves({
            id: "1",
            attendees: []
        });

        EventService.__set__({
            "findOne": findOneStub
        });

        const getSerializedEventStub = sinon.stub().resolves({});

        EventService.__set__({
            "getSerializedEvent": getSerializedEventStub
        });

        const getUserIdStub = sinon.stub().resolves(null);

        EventService.__set__({
            "getUserId": getUserIdStub
        });

        const response = await EventService.handleGet(req, res);

        assert(OK_LBL === response.message);
    });

    it("Cannot sign up to an existing event", async () => {
        const findOneStub = sinon.stub().resolves(null);

        EventService.__set__({
            "findOne": findOneStub
        });

        const getAttendanceIdStub = sinon.stub().resolves([]);

        EventService.__set__({
            "getAttendanceId": getAttendanceIdStub
        });

        const getUserIdStub = sinon.stub().resolves(null);

        EventService.__set__({
            "getUserId": getUserIdStub
        });

        const response = await EventService.handleEventSignUp(req, res);

        assert("error" === response.error);
    });

    it("Event serialization", async () => {
        const e = new EventMock();

        Event.__set__({
            "timeToString": sinon.stub().resolves("9:00")
        })

        Event.__set__({
            "dateToString": sinon.stub().resolves("10/10/2010")
        })

        const serializedEvent = await Event.getSerializedEvent(e);

        assert(e.name === serializedEvent.name);
    });

    it("Cannot check an unexisting event", async () => {
        const findOneStub = sinon.stub().resolves(null);

        const updateStub = sinon.stub().resolves(null);

        EventService.__set__({
            "findOne": findOneStub,

            "update": updateStub
        });

        const response = await EventService.handleEventCheck(req, res);

        assert("error" === response.error);
    });

    it("Cannot check an event without attendances", async () => {
        const findOneStub = sinon.stub().resolves({
            id: 1,
            attendees: []
        });

        const updateStub = sinon.stub().resolves({ });

        EventService.__set__({
            "findOne": findOneStub,

            "update": updateStub
        });

        const response = await EventService.handleEventCheck(req, res);

        assert("error" === response.error);
    });

    it("Cannot check an event which was already checked", async () => {
        const findOneStub = sinon.stub().resolves({
            id: 1,
            attendees:
                [
                    {
                        attendances: {
                            wasUsed: false
                        }
                    }
                ]
        });

        const updateStub = sinon.stub().resolves({ });

        EventService.__set__({
            "findOne": findOneStub,

            "update": updateStub
        });

        const response = await EventService.handleEventCheck(req, res);

        assert(response);
    });
});
