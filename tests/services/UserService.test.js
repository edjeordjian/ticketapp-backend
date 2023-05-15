const sinon = require("sinon");

const rewire = require("rewire");

const assert = require("assert");
const { EventMock } = require("../mocks/EventMock");

const UserService = rewire("../../src/services/users/UserService");

describe("UserService", () => {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        const setErrorResponseStub = sinon.stub().returns({
            "error": "error"
        });

        const stateIdStub = sinon.stub().returns(1);

        UserService.__set__({
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
    })

   it("Checks if user is organizer", () => {
       const findOneStub = sinon.stub().returns({
          id: 1,
          is_organizer: false
       });

       UserService.__set__({
           "findOne": findOneStub
       });

       const response = UserService.userIsOrganizer("1", null);

       assert(response);
   });

    it("Checks if user is organizer 2", () => {
        const findOneStub = sinon.stub().returns({
            id: 1,
            is_organizer: false
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userIsOrganizer(null, "a");

        assert(response);
    });

    it("Checks if user is consumer", () => {
        const findOneStub = sinon.stub().returns({
            id: 1,
            is_consumer: false
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userIsConsumer("1", null);

        assert(response);
    });

    it("Checks if user is consumer 2", () => {
        const findOneStub = sinon.stub().returns({
            id: 1,
            is_consumer: false
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userIsConsumer(null, "a");

        assert(response);
    });

    it("Checks if user is staff", () => {
        const findOneStub = sinon.stub().returns({
            id: 1,
            is_staff: false
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userIsStaff("1", null);

        assert(response);
    });

    it("Checks if user is staff 2", () => {
        const findOneStub = sinon.stub().returns({
            id: 1,
            is_staff: false
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userIsStaff(null, "a");

        assert(response);
    });

    it("Checks if user exists", () => {
        const findOneStub = sinon.stub().returns({
            id: 1
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userExists("1", null);

        assert(response);
    });

    it("Checks if user exists 2", () => {
        const findOneStub = sinon.stub().returns({
            id: 1
        });

        UserService.__set__({
            "findOne": findOneStub
        });

        const response = UserService.userExists(null, "a");

        assert(response);
    });

    it("Cancel event", async () => {
        const findOneStub = sinon.stub().resolves(new EventMock());

        const updateStub = sinon.stub().resolves({});

        const destroyStub = sinon.stub().resolves({
            "name": "name"
        });

        const getStateIdStub = sinon.stub().resolves(1);

        const verifyTokenStub = sinon.stub().resolves("100");

        const getUserWithEmailStub = sinon.stub().resolves({
            "name": "name"
        });

        const suspendGivenEventStub = sinon.stub().resolves(() => {});

        const notifyCancelledEventStub = sinon.stub().resolves(() => {});

        UserService.__set__({
            "verifyToken": verifyTokenStub,

            "getUserWithEmail": getUserWithEmailStub,

            "findOne": findOneStub,

            "destroy": destroyStub,

            "update": updateStub,

            "notifyCancelledEvent": notifyCancelledEventStub,

            "getStateId": getStateIdStub,

            "suspendGivenEvent": suspendGivenEventStub
        });

        const response = await UserService.blockUser(req, res);

        assert(response);
    });

});