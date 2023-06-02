const rewire = require("rewire");

const sinon = require("sinon");

const assert = require("assert");
const { OK_LBL } = require("../../../src/constants/messages");

const EventCalendarScheduleService = rewire("../../../src/services/events/EventCalendarScheduleService");

describe("Event calendar schedule service", () => {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        const setErrorResponseStub = sinon.stub().returns({
            "error": "error"
        });

        const stateIdStub = sinon.stub().returns(1);

        EventCalendarScheduleService.__set__({
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

    it("Cannot save record of event in calendar if user does not exist", async () => {
        const result = await EventCalendarScheduleService.saveRecordOfEventScheduleInCalendar(req, res);

        assert(result.error !== undefined);
    });

    it("Save record of event in calendar", async () => {
        const createStub = sinon.stub().resolves({
            "name": "name"
        });

        const findOneStub = sinon.stub().resolves({
            "name": "name"
        });

        EventCalendarScheduleService.__set__({
            "findOne": findOneStub,

            "create": createStub
        });

        req.body.userId = 1;

        req.body.eventId = 2;

        req.body.scheduleId = 3;

        const result = await EventCalendarScheduleService.saveRecordOfEventScheduleInCalendar(req, res);

        console.log(result);

        assert(result.message === OK_LBL);
    });

    it("Get scheduule id", async () => {
        const e = {
            event_calendar_schedules: [{
                userId: 5,
                createdAt: 1,
                schedule_id: 99
            }]
        }
        const result = EventCalendarScheduleService.getScheduleId(e, 5);

        assert(result === 99);
    });

});
