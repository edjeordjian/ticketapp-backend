const { dateToString } = require("../helpers/DateHelper");

const getReportDataForUser = (report) => {
    return {
        eventName: report.events_reports.name,
        eventId: report.events_reports.id,
        reason: report.report_categories[0].name,
        text: report.text,
        date: dateToString(report.createdAt)
    }
};

const getReportDataForEvent = (report) => {
    const reporter = report.reporter;

    return {
        reporter: `${reporter.first_name} ${reporter.last_name}`,
        reason: report.report_categories[0].name,
        text: report.text,
        date: dateToString(report.createdAt)
    }
}

module.exports = {
    getReportDataForUser, getReportDataForEvent
};
