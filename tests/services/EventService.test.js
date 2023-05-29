const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const { EventMock } = require("../mocks/EventMock");

const Event = rewire("../../src/data/model/Events");

const EventRepository = rewire("../../src/repository/EventRepository");

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

        const stateIdStub = sinon.stub().returns(1);

        EventService.__set__({
            "setOkResponse": setOkResponseStub,

            "setErrorResponse": setErrorResponseStub,

            "logInfo": sinon.stub(),

            "getStateId": stateIdStub
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

        e.time = new Date();

        e.date = new Date();

        const serializedEvent = await EventRepository.getSerializedEvent(e);

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

    it("Update event", async () => {
        const findOneStub = sinon.stub().resolves(new EventMock());

        const destroyStub = sinon.stub().resolves({
           "name": "name"
        });

        req.body = {
            faq: [],
            agenda: []
        };

        const verifyTokenStub = sinon.stub().resolves("100");

        const getUserWithEmailStub = sinon.stub().resolves({
            "name": "name"
        });

        const notifyEventChangeStub = sinon.stub().resolves(() => {});

        EventService.__set__({
            "verifyToken": verifyTokenStub,

            "getUserWithEmail": getUserWithEmailStub,

            "findOne": findOneStub,

            "destroy": destroyStub,

            "notifyEventChange": notifyEventChangeStub
        });

        const response = await EventService.handleUpdateEvent(req, res);

        assert(response);
    });

    it("Cancel event", async () => {
        const findOneStub = sinon.stub().resolves(new EventMock());

        const updateStub = sinon.stub().resolves({});

        const destroyStub = sinon.stub().resolves({
            "name": "name"
        });

        req.body = {
            faq: [],
            agenda: []
        };

        const verifyTokenStub = sinon.stub().resolves("100");

        const getUserWithEmailStub = sinon.stub().resolves({
            "name": "name"
        });

        const notifyCancelledEventStub = sinon.stub().resolves(() => {});

        EventService.__set__({
            "verifyToken": verifyTokenStub,

            "getUserWithEmail": getUserWithEmailStub,

            "findOne": findOneStub,

            "destroy": destroyStub,

            "update": updateStub,

            "notifyCancelledEvent": notifyCancelledEventStub
        });

        const response = await EventService.cancelEvent(req, res);

        assert(response);
    });

    it("Cancel unexisting event", async () => {
        const findOneStub = sinon.stub().resolves({
            error: "message"
        });

        const updateStub = sinon.stub().resolves({});

        const destroyStub = sinon.stub().resolves({
            "name": "name"
        });

        req.body = {
            faq: [],
            agenda: []
        };

        const verifyTokenStub = sinon.stub().resolves("100");

        const getUserWithEmailStub = sinon.stub().resolves({
            "name": "name"
        });

        const notifyCancelledEventStub = sinon.stub().resolves(() => {});

        EventService.__set__({
            "verifyToken": verifyTokenStub,

            "getUserWithEmail": getUserWithEmailStub,

            "findOne": findOneStub,

            "destroy": destroyStub,

            "update": updateStub,

            "notifyCancelledEvent": notifyCancelledEventStub
        });

        const response = await EventService.cancelEvent(req, res);

        assert(response.error);
    });

    it("Cron event update error", async () => {
        const findAllStub = sinon.stub().resolves({
            error: "message"
        });

        const notifyTomorrowEventsStub = sinon.stub().resolves(() => {});

        EventService.__set__({
            "findAll": findAllStub,

            "notifyTomorrowEvents": notifyTomorrowEventsStub
        });

        const result = await EventService.cronEventUpdate(req, res);

        assert(result);
    });

    it("Cron event update", async () => {
        const findAllStub = sinon.stub().resolves([]);

        const updateStub = sinon.stub().resolves([]);

        const getStateId = sinon.stub().resolves(0);

        EventService.__set__({
            "findAll": findAllStub,
            "getStateId": getStateId,
            "update": updateStub
        });

        await EventService.cronEventUpdate(req, res);

        assert(true);
    });

    it("Suspend event", async () => {
        const findOneStub = sinon.stub().resolves({
            "name": "name"
        });

        const suspendGivenEventStub = sinon.stub().resolves("");

        EventService.__set__({
            "findOne": findOneStub,

            "suspendGivenEvent": suspendGivenEventStub
        });

        const response = await EventService.suspendEvent(req, res);

        assert(response);
    });

    it("Cancel event", async () => {
        const findOneStub = sinon.stub().resolves({
            "name": "name"
        });

        const suspendGivenEventStub = sinon.stub().resolves("");

        const getStateIdStub = sinon.stub().resolves("");

        const destroyStub = sinon.stub().resolves({});

        const updateStub = sinon.stub().resolves({});

        EventService.__set__({
            "findOne": findOneStub,

            "verifyToken": suspendGivenEventStub,

            "getStateId": getStateIdStub,

            "destroy": destroyStub,

            "update": updateStub
        });

        const response = await EventService.cancelEvent(req, res);

        assert(response);
    });

    it("Get attendances stats", async () => {
        req.query = {
            eventId: 1
        };

        const findOneStub = sinon.stub().resolves({
            "attendees": [
                {
                    attendances: {
                        attended: true,
                        updatedAt: new Date("2023-05-29T20:09:26.352Z")
                    }
                }
            ]
        });

        EventService.__set__({
            "findOne": findOneStub
        });

        const result = await EventService.getAttendancesStats(req, res);

        assert(result.message === OK_LBL);
    });

    it("Get attendances range", async () => {
        req.query = {
            eventId: 1
        };

        const findOneStub = sinon.stub().resolves({
            "attendees": [
                {
                    attendances: {
                        attended: true,
                        updatedAt: new Date("2023-05-29T20:09:26.352Z")
                    }
                }
            ],
            "getGroups": () => {return []}
        });

        const eventIdStub = sinon.stub().resolves(1);

        const getOwnersIdsStub = sinon.stub().resolves(["1"]);

        EventService.__set__({
            "findOne": findOneStub,
            "getUserId": eventIdStub,
            "getStateId": eventIdStub,
            "getOwnersIds": getOwnersIdsStub
        });

        const result = await EventService.getAttendancesRange(req, res);

        assert(result.message === OK_LBL);
    });
});
