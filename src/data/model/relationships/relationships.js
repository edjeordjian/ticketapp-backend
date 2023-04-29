const { defineEventStateRelationship } = require("./EventStateRelationship");

const { defineEventReportUserEventRelationship } = require("./EventReportUserEventRelationship");

const { defineEventReportTypeEventReportRelationship } = require("./EventReportTypeEventReport");

const { defineEventOrganizerRelationship } = require("./EventOrganizerRelationship");

const { defineEventTypeEventRelationship } = require("./EvenTypeEventRelationship");

const { defineEventSpeakerRelationship } = require("./SpeakerEventRelationship");

const { defineGroupGroupParticipantRelationship } = require("./GroupParticipantsRelationship");

const { defineEventFAQRelationship } = require("./EventsFAQRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();

    defineEventOrganizerRelationship();

    defineGroupGroupParticipantRelationship();

    defineEventFAQRelationship();

    defineEventReportTypeEventReportRelationship();

    defineEventReportUserEventRelationship();

    defineEventStateRelationship();
};

module.exports = {
    defineRelationships
};
