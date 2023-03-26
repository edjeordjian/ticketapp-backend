const rewire = require("rewire");

const assert = require("assert");

const sinon = require("sinon");

const {OK_LBL} = require("../../../src/constants/messages");

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

        assert(OK_LBL === response.status);
    });
});
