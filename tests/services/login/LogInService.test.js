const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const LogInService = rewire("../../../src/services/login/LogInService");

describe("LogInService", function() {
    it("Basic case of log in.", async () => {
        const setOkResponseMock = sinon.stub().returns({
            "status": "Ok"
        });

        LogInService.__set__("setOkResponse", setOkResponseMock);

        const req = {};

        const res = {
            send: sinon.stub()
        };

        const response = await LogInService.handleLogIn(req, res);

        assert("Ok" === response.status);
    });
});
