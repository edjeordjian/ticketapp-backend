const { dateToString } = require("../helpers/DateHelper");

const getReportData = (report) => {
    return {
        eventName: report.events_reports.name,
        eventId: report.events_reports.id,
        reason: report.report_categories[0].name,
        text: report.text,
        date: dateToString(report.createdAt)
    }
}

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
        lastReport = reports.map(report => report.createdAt)
            .reduce((date1, date2) => {
                return date1 > date2
            });
    }

    return {
        id: user.id,

        name: `${user.first_name} ${user.last_name}`,

        email: user.email,

        isBlocked: user.is_blocked,

        reportsNumber: reports.length,

        lastReportDate: lastReport ? dateToString(lastReport) : "",

        reports: reports.map(getReportData),

        events: reports.map(getEventData)
    }
};

module.exports = {
    getSerializedUserWithReports
};
