const rewire = require("rewire");
const assert = require('assert');
const {
  getReportDataForUser,
  getReportDataForEvent,
  getLastReportDate } = rewire("../../src/repository/ReportRepository");
const { dateToString } = require('../../src/helpers/DateHelper');

describe('getReportDataForUser', () => {
  it('should return an object with correct properties', () => {
    const report = {
      events_reports: { name: 'event name', id: 1 },
      report_categories: [{ name: 'category name' }],
      text: 'report text',
      createdAt: new Date(),
    };
    const reportData = getReportDataForUser(report);

    assert.strictEqual(reportData.eventName, report.events_reports.name);
    assert.strictEqual(reportData.eventId, report.events_reports.id);
    assert.strictEqual(reportData.reason, report.report_categories[0].name);
    assert.strictEqual(reportData.text, report.text);
    assert.strictEqual(reportData.date, dateToString(report.createdAt));
  });
});

describe('getReportDataForEvent', () => {
  it('should return an object with correct properties', () => {
    const report = {
      reporter: { first_name: 'first', last_name: 'last' },
      report_categories: [{ name: 'category name' }],
      text: 'report text',
      createdAt: new Date(),
    };
    const event = { id: 1, name: 'event name' };
    const reportData = getReportDataForEvent(report, event);

    assert.strictEqual(reportData.eventId, event.id);
    assert.strictEqual(reportData.eventName, event.name);
    assert.strictEqual(reportData.reporter, `${report.reporter.first_name} ${report.reporter.last_name}`);
    assert.strictEqual(reportData.reason, report.report_categories[0].name);
    assert.strictEqual(reportData.text, report.text);
    assert.strictEqual(reportData.date, dateToString(report.createdAt));
  });
});

describe('getLastReportDate', () => {
  it('should return null if reports array is empty', () => {
    const reports = [];
    const lastDate = getLastReportDate(reports);

    assert.strictEqual(lastDate, null);
  });

  it('should return the correct last date', () => {
    const reports = [
      { date: "01/01/2022" },
      { date: "01/01/2022" },
      { date: "01/01/2022" }
      ];

    const date = getLastReportDate(reports);

    assert.strictEqual(date, reports[2].date);
  });
});
