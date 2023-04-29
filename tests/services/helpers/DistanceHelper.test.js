const rewire = require("rewire");

const DistanceHelper = rewire("../../../src/helpers/DistanceHelper");

const assert = require("assert");


describe('DistanceHelper.getDistanceFromLatLonInKm', () => {
    it('calculates distance between San Francisco and Los Angeles', () => {
        const sfLat = 37.7749;
        const sfLon = -122.4194;
        const laLat = 34.0522;
        const laLon = -118.2437;

        const distance = DistanceHelper.getDistanceFromLatLonInKm(sfLat, sfLon, laLat, laLon);
        assert.strictEqual(distance, 559.1205770615533);
    });

    it('calculates distance between New York and London', () => {
        const nyLat = 40.7128;
        const nyLon = -74.0060;
        const londonLat = 51.5074;
        const londonLon = -0.1278;

        const distance = DistanceHelper.getDistanceFromLatLonInKm(nyLat, nyLon, londonLat, londonLon);
        assert.strictEqual(distance, 5570.222179737958);
    });

    it('calculates distance between Buenos Aires City and Mar del Plata', () => {
        const baLat = -34.6037;
        const baLon = -58.3816;
        const mdpLat = -38.0055;
        const mdpLon = -57.5426;

        const distance = DistanceHelper.getDistanceFromLatLonInKm(baLat, baLon, mdpLat, mdpLon);
        assert.strictEqual(distance, 385.6564146084836);
    });
});