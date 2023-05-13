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

const getLastReportDate = (reports) => {
    if (reports.length <= 0) {
        return null
    }

    return reports.map(report => report.createdAt)
        .reduce((date1, date2) => {
            return date1 > date2
        });
}

module.exports = {
    getReportDataForUser, getReportDataForEvent, getLastReportDate
};
