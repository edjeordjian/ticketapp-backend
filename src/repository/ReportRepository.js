const { momentToHumanDateFromat } = require("../helpers/DateHelper");
const { dateToMomentFormat } = require("../helpers/DateHelper");
const { getDateOnly } = require("../helpers/DateHelper");
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

const getReportDataForEvent = (report, event) => {
    const reporter = report.reporter;

    return {
        eventId: event.id,
        eventName: event.name,
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

    const result =  reports.map(report => dateToMomentFormat(report.date))
        .reduce((date1, date2) => {
            return date1 > date2? date1: date2;
        });

    return momentToHumanDateFromat(result);
}

const getSortedByReportsWithDate = (startDate, endDate, aList) => {
    if (startDate && endDate) {
        startDate = new Date(startDate).toISOString();

        endDate = new Date(endDate).toISOString();

        aList.map(x => {
            x.reports = x.reports.filter(report => {
                    const reportDate = getDateOnly(report.createdAt).toISOString()

                    return reportDate >= startDate && reportDate <= endDate;
                }
            );
        });
    }

    aList.sort((x1, x2) => {
        const a = x1.reports ? x1.reports.length : 0;

        const b = x2.reports ? x2.reports.length : 0;

        return b - a;
    });
};

module.exports = {
    getReportDataForUser, getReportDataForEvent, getLastReportDate,
    getSortedByReportsWithDate
};
