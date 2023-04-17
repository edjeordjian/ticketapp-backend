const { defineEventAttendanceRelationship } = require("../model/Attendances");

const { defineEventOrganizerRelationship } = require("../model/EventOrganizerRelationship");

const { defineEventTypeEventRelationship } = require("../model/EvenTypeEventRelationship");

const { defineEventSpeakerRelationship } = require("../model/SpeakerEventRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();

    defineEventOrganizerRelationship();
};

module.exports = {
    defineRelationships
};
