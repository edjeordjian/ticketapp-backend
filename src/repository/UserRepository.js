const { getLastReportDate } = require("./ReportRepository");

const { getReportDataForUser } = require("./ReportRepository");

const { dateToString } = require("../helpers/DateHelper");

const getEventData = (report) => {
    const event = report.events_reports;

    return {
        id: event.id,
        name: event.name,
        mainPicture: event.wallpaper_url
    }
}

const getSerializedUserWithReports = (user) => {
    const reports = user.reports ? user.reports : [];

    let lastReport;

    if (reports.length > 0) {
        lastReport = getLastReportDate(reports);
    }

    return {
        id: user.id,

        name: `${user.first_name} ${user.last_name}`,

        email: user.email,

        isBlocked: user.is_blocked,

        reportsNumber: reports.length,

        lastReportDate: lastReport ? dateToString(lastReport) : "",

        reports: reports.map(getReportDataForUser),

        events: reports.map(getEventData)
    }
};

module.exports = {
    getSerializedUserWithReports
};
