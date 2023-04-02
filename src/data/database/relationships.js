const {Speakers} = require("../model/Speakers");

const {Events} = require("../model/Events");

const {User} = require("../model/User");

const {EventTypes} = require("../model/EventTypes");

const {defineEventList} = require("../model/SpeakerEventRelationship");

const {defineEventTypeEventRelationship} = require("../model/EvenTypeEventRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventList();
};

module.exports = {
    defineRelationships
};
