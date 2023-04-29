const { User } = require("../User");

const { EventReport } = require("../EventReport");

const {
    REPORTS_RELATION_NAME,
    REPORTER_RELATION_NAME
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
};

module.exports = {
    defineEventReportUserEventRelationship
};
