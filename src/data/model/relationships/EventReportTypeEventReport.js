const {EventReport} = require("../EventReport");

const {EventReportCategory} = require("../EventReportCategory");

const {database} = require("../../database");

const defineEventReportTypeEventReportRelationship = () => {
    const EventReportCategory_EventReport = database.define(
        "event_report_category_event_report",
        {});

    EventReport.belongsToMany(EventReportCategory,
        {
            through: EventReportCategory_EventReport
        });

    EventReportCategory.belongsToMany(EventReport,
        {
            through: EventReportCategory_EventReport
        });
};

module.exports = {
    defineEventReportTypeEventReportRelationship
};
