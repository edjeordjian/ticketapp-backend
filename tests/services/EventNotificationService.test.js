const rewire = require("rewire");

const sinon = require("sinon");

const assert = require("assert");
const { DateMock } = require("../mocks/DateMock");

const EventNotificationService = rewire("../../src/services/events/EventNotificationService");


describe("Event notification service", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Get attendees tokens is empty", async () => {
        const eventStub = {
            attendees: [
                {
                    attendances: {
                        userId: 1
                    }
                }
            ]
        }

        const findAllStub = sinon.stub().resolves([]);

        EventNotificationService.__set__({
            "findAll": findAllStub
        });

        const result = await EventNotificationService.getAttendeesTokens(eventStub);

        assert(result.length === 0);
    });

    it("Get attendees tokens error", async () => {
        const eventStub = {
            attendees: [
                {
                    attendances: {
                        userId: 1
                    }
                }
            ]
        }

        const findAllStub = sinon.stub().resolves({
            error: "error"
        });

        EventNotificationService.__set__({
            "findAll": findAllStub
        });

        const result = await EventNotificationService.getAttendeesTokens(eventStub);

        assert(result === "error");
    });

    it("Notifiy tomorrow events", async () => {
        const getStateId = sinon.stub().resolves(1);

        const findAllStub = sinon.stub().resolves([{}]);

        const sendNotificationToStub = sinon.stub().resolves(() => {});

        EventNotificationService.__set__({
            "Date": DateMock,
            "getStateId": getStateId,
            "findAll": findAllStub,
            "sendNotificationTo": sendNotificationToStub
        });

        const result = await EventNotificationService.notifyTomorrowEvents();

        assert(result !== "error");
    });

    it("Notifiy tomorrow events error", async () => {
        const getStateId = sinon.stub().resolves(1);

        const findAllStub = sinon.stub().resolves({
            error: "error"
        });

        EventNotificationService.__set__({
            "Date": DateMock,
            "getStateId": getStateId,
            "findAll": findAllStub
        });

        const result = await EventNotificationService.notifyTomorrowEvents();

        assert(result === "error");
    });

    it("Notifiy event change", async () => {
        const sendNotificationToStub = sinon.stub().resolves(() => {});

        EventNotificationService.__set__({
            "sendNotificationTo": sendNotificationToStub
        });

        const result = await EventNotificationService.notifyEventChange({
            id: 1,
            name: "name"
        });

        assert(result !== "error");
    });

    it("Notifiy cancelled event", async () => {
        const sendNotificationToStub = sinon.stub().resolves(() => {});

        EventNotificationService.__set__({
            "sendNotificationTo": sendNotificationToStub
        });

        const result = await EventNotificationService.notifyCancelledEvent({
            id: 1,
            name: "name"
        });

        assert(result !== "error");
    });

});

