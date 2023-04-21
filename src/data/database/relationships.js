const { defineEventOrganizerRelationship } = require("../model/EventOrganizerRelationship");

const { defineEventTypeEventRelationship } = require("../model/EvenTypeEventRelationship");

const { defineEventSpeakerRelationship } = require("../model/SpeakerEventRelationship");

const { defineGroupGroupParticipantRelationship } = require("../model/GroupParticipantsRelationship");

const { defineEventFAQRelationship } = require("../model/EventsFAQRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();

    defineEventOrganizerRelationship();

    defineGroupGroupParticipantRelationship();

    defineEventFAQRelationship();
};

module.exports = {
    defineRelationships
};
