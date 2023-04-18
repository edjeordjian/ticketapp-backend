const { defineEventOrganizerRelationship } = require("../model/EventOrganizerRelationship");

const { defineEventTypeEventRelationship } = require("../model/EvenTypeEventRelationship");

const { defineEventSpeakerRelationship } = require("../model/SpeakerEventRelationship");

const { defineGroupGroupParticipantRelationship } = require("../model/GroupParticipantsRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();

    defineEventOrganizerRelationship();

    defineGroupGroupParticipantRelationship();
};

module.exports = {
    defineRelationships
};
