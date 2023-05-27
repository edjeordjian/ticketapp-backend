const { defineEventRelationWithEventSchedule } = require("./EventRelationWithEventSchedule");

const { defineEventStateRelationship } = require("./EventStateRelationship");

const { defineEventReportUserEventRelationship } = require("./EventReportUserEventRelationship");

const { defineEventReportTypeEventReportRelationship } = require("./EventReportTypeEventReport");

const { defineEventOrganizerRelationship } = require("./EventOrganizerRelationship");

const { defineEventTypeEventRelationship } = require("./EvenTypeEventRelationship");

const { defineEventSpeakerRelationship } = require("./SpeakerEventRelationship");

const { defineGroupGroupParticipantRelationship } = require("./GroupParticipantsRelationship");

const { defineEventFAQRelationship } = require("./EventsFAQRelationship");

const {defineFavouriteEventsRelationship} = require("./FavouriteEventsRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventSpeakerRelationship();

    defineEventOrganizerRelationship();

    defineGroupGroupParticipantRelationship();

    defineEventFAQRelationship();

    defineEventReportTypeEventReportRelationship();

    defineEventReportUserEventRelationship();

    defineEventStateRelationship();

    defineFavouriteEventsRelationship();

    defineEventRelationWithEventSchedule();
};

module.exports = {
    defineRelationships
};
