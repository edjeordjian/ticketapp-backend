const { Speakers } = require("../model/Speakers");

const { Events } = require("../model/Events");

const { User } = require("../model/User");

const { EventTypes } = require("../model/EventTypes");

const { defineEventList } = require("../model/SpeakerEventRelationship");

const { defineEventTypeEventRelationship } = require("../model/EvenTypeEventRelationship");
const { defineEventSpeakerRelationship } = require("../model/SpeakerEventRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();
};

module.exports = {
    defineRelationships
};
