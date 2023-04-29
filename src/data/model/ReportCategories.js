const { Sequelize } = require("sequelize");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const ReportCategory = database.define("report_category", {
    name: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const getSerializedReportCategory = (category) => {
    return {
        id: category.id,

        name: category.name
    }
};

module.export = {
    ReportCategory, getSerializedReportCategory
};
