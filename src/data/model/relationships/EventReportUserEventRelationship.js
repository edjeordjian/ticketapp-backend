const { User } = require("../User");
const { Events } = require("../Events");

const { EventReport } = require("../EventReport");

const {
    REPORTS_RELATION_NAME,
    REPORTER_RELATION_NAME, EVENTS_REPORT_RELATION_NAME
    } = require("../../../constants/dataConstants");


const defineEventReportUserEventRelationship = () => {
    User.hasMany(EventReport,
        {
            foreignKey: "reporter_id",
            as: REPORTS_RELATION_NAME
        });

    EventReport.belongsTo(User,
        {
            foreignKey: "reporter_id",
            as: REPORTER_RELATION_NAME
        });

    Events.hasMany(EventReport,
        {
            foreignKey: "event_id",
            as: EVENTS_REPORT_RELATION_NAME
        });

    EventReport.belongsTo(Events,
        {
            foreignKey: "event_id",
            as: EVENTS_REPORT_RELATION_NAME
        });
};

module.exports = {
    defineEventReportUserEventRelationship
};
