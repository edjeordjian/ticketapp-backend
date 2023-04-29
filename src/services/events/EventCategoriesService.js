const { getSerializedEventReportCategory } = require("../../data/model/EventReportCategory");
const { EventReportCategory } = require("../../data/model/EventReportCategory");
const { OK_LBL } = require("../../constants/messages");
const { Op } = require("sequelize");
const { EventTypes } = require("../../data/model/EventTypes");

const { findAll } = require("../../helpers/QueryHelper");

const { setErrorResponse } = require("../../helpers/ResponseHelper");

const { getSerializedEventType } = require("../../data/model/EventTypes");

const { setOkResponse } = require("../../helpers/ResponseHelper");

const getAllSerialized = async (req,
                                res,
                                model,
                                serializationFn,
                                response_entry) => {
    let result = await findAll(model);

    if (result === null) {
        result = [];
    } else if (result.error) {
        return setErrorResponse(result.error, res);
    }

    const types = [];

    result.forEach(e => types.push(serializationFn(e)));

    const response = {
        response_entry: types
    };

    return setOkResponse(OK_LBL, res, response);
}

const handleGetTypes = async (req, res) => {
    return await getAllSerialized(req,
        res,
        EventTypes,
        getSerializedEventType,
        "event_types");
};

const getReportCategories = async (req, res) => {
    return await getAllSerialized(req,
        res,
        EventReportCategory,
        getSerializedEventReportCategory,
        "report_categories");
};

module.exports = {
    handleGetTypes, getReportCategories
};
