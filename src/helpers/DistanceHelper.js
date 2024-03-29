const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(parseFloat(lat2) - parseFloat(lat1));
    const dLon = deg2rad(parseFloat(lon2) - parseFloat(lon1));
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(parseFloat(lat1))) * Math.cos(deg2rad(parseFloat(lat2))) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const deg2rad = deg => deg * (Math.PI / 180);

module.exports = {
    getDistanceFromLatLonInKm
}