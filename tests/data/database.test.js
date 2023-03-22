const assert = require('assert');

const {RESET_DATABASE} = require("../../src/constants/dataConstants");

describe('Database tests', function() {
    it('not restarting database', async function() {
        assert.strictEqual(RESET_DATABASE, false);
    });
});
