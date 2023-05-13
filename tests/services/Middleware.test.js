const rewire = require("rewire");

const sinon = require("sinon");

const assert = require("assert");

const { userIsOrganizer } = require("../../src/services/users/UserService");

const Middleware = rewire("../../src/routes/Middleware");

describe("Middleware", () => {
    const req = {
        headers: {
            authorization: "authorization "
        },

        method: "POST",

        body: {}
    };

    const res = {};

    const next = () => {};

    beforeEach(() => {
        const userIsOrganizerStub = sinon.stub().returns(undefined);

        const setErrorResponseStub = sinon.stub().returns({
            "error": "error"
        });

        const verifyTokenStub = sinon.stub().returns({
               user_id: "1"
        });

        Middleware.__set__({
           "verifyToken":  verifyTokenStub,

           "userIsOrganizer": userIsOrganizerStub,

           "setErrorResponse": setErrorResponseStub
        });
    });

    afterEach(() => {
        sinon.restore();
    })

    it("Checks if it is not organizer", async () => {
        const isOrganizer = await Middleware.isOrganizerMiddleware(req, res, next);

        assert(isOrganizer.error);
    });

    it("Checks if request has empty body", async () => {
        const isEmptyBody = await Middleware.emptyBodyMiddleware(req, res, next);

        assert(isEmptyBody.error);
    });

    it("Checks if it is not allowed", async () => {
        const isAllowedMiddleware = await Middleware.isAllowedMiddleware(req, res, next, (_, __) => false);

        assert(isAllowedMiddleware.error);
    });

    it("Checks firebase auth error", async () => {
        const response = await Middleware.firebaseAuthMiddleware(req, res, next);

        assert(response.error);
    });
});
