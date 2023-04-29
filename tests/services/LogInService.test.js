const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const { OK_LBL } = require("../../src/constants/messages");

const LogInService = rewire("../../src/services/login/LogInService");

describe("LogInService", function () {
    let req, res;

    beforeEach(() => {
        const setOkResponseStub = sinon.stub().returns({
            "message": "Ok"
        });

        LogInService.__set__({
            "setOkResponse": setOkResponseStub,

            "logInfo": sinon.stub()
        });

        req = {
            body: {
                email: "a@a.com"
            }
        };

        res = {
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Log in with existing user", async () => {
        const findOneStub = sinon.stub().resolves({
            "id": "id",
            "email": "email"
        });

        LogInService.__set__({
            "findOne": findOneStub
        });

        const response = await LogInService.handleLogIn(req, res);

        assert(OK_LBL === response.message);
    });

    it("Log in with new user", async () => {
        const setErrorResponseStub = sinon.stub().returns({
            "error": "Ok"
        });

        const findOneStub = sinon.stub().resolves(null);

        const createStub = sinon.stub().resolves({
            error: "error"
        });

        LogInService.__set__({
            "findOne": findOneStub,
            "create": createStub,
            "setErrorResponse": setErrorResponseStub,
        });

        const response = await LogInService.handleLogIn(req, res);

        assert(response.error !== undefined);
    });
});
