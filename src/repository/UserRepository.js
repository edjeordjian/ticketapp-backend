const { getLastReportDate } = require("./ReportRepository");

const { getReportDataForUser } = require("./ReportRepository");

const { dateToString } = require("../helpers/DateHelper");

const getEventData = (e) => {
    return {
        id: e.id,
        name: e.name,
        mainPicture: e.wallpaper_url
    }
}

const getSerializedUserWithReports = async (user) => {
    let reports = user.reports ? user.reports : [];

    reports = reports.map(getReportDataForUser);

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

        lastReportDate: lastReport ? lastReport : "",

        reports: reports
    }
};

module.exports = {
    getSerializedUserWithReports
};
