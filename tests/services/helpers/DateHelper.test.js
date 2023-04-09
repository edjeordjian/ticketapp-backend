const rewire = require("rewire");

const { DateMock } = require("../../mocks/DateMock");

const DateHelper = rewire("../../../src/services/helpers/DateHelper");

const assert = require("assert");

describe("Date Helper", () => {
    it("Get quick date", () => {
        DateHelper.__set__({
            "Date": DateMock
        });

        assert.strictEqual(DateHelper.getQuickDate(),
            "2023-04-08");
    });

    it("Date from string", () => {
        DateHelper.__set__({
            "Date": DateMock
        });

        assert(DateHelper.dateFromString("2023-04-08T23:24:15.786Z").date === undefined);
    });

    it("Date to string", () => {
        DateHelper.__set__({
            "Date": DateMock
        });

        assert.strictEqual(DateHelper.dateToString(new DateMock()),
            "Sat Apr 08 2023 20:24:10 GMT-0300 (Argentina Standard Time)");
    });

    it("Time to string", () => {
        DateHelper.__set__({
            "Date": DateMock
        });

        assert.strictEqual(DateHelper.timeToString(new DateMock()),
            "00:00");
    });
});