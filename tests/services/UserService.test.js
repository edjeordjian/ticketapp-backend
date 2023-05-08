const sinon = require("sinon");

const rewire = require("rewire");

const assert = require("assert");

const UserService = rewire("../../src/services/users/UserService");

describe("UserService", () => {
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
});