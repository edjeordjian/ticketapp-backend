const rewire = require("rewire");

const assert = require("assert");

const HistogramHelper = rewire("../../src/helpers/HistogramHelper");

describe("Histogarm helper", () => {
    it("Get time frequencies", () => {
        const times = ["13:01", "13:02", "13:03"];

        const expectedResult =  [ '13:01', '13:02', '13:03', '13:04', '13:05', '13:06' ];

        const result = HistogramHelper.getTimeFrequencies(times);

        assert(result[3] === expectedResult[3]);
    });

    it("Get data in buckets", () => {
        const times = ["13:01", "13:02", "13:03"];

        const labels = ["A", "B", "C"];

        const result = HistogramHelper.getDataInBuckets(times, labels);

        assert(3 === result[0]);
    });
})