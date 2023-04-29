const assert = require("assert");

const sinon = require("sinon");

const {setUnexpectedErrorResponse} = require("../../src/helpers/ResponseHelper");

const {setErrorResponse} = require("../../src/helpers/ResponseHelper");

const {setOkResponse} = require("../../src/helpers/ResponseHelper");


describe("ResponseHelper", function() {
    let res;

    beforeEach(() => {
        res = {
            status: () => {
                return {
                    json: (a_json) => {
                        return a_json
                    }
                }
            }
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Ok response", async () => {
        const a_message = "A message";

        const response = setOkResponse(a_message, res);

        assert(a_message === response.message);
    });

    it("Error response", async () => {
        const a_message = "An error message";

        const response = setErrorResponse(a_message, res);

        assert(a_message === response.error);
    });

    it("Unexpected error response", async () => {
        const a_message = "An error message";

        const response = setUnexpectedErrorResponse(a_message, res);

        assert(a_message === response.error);
    });
});
