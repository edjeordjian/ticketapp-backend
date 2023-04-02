const {Speakers} = require("./Speakers");

const {Events} = require("./Events");

const defineEventList = () => {
    Events.hasMany(Speakers);
};

module.exports = {
    defineEventList
};

