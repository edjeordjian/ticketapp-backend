const { MAX_EVENT_CAPACITY } = require("../../constants/events/eventsConstants");
const { getSerializedEventType } = require("../../data/model/EventTypes");
const { getSerializedEvent } = require("../../data/model/Events");

const { Op } = require("sequelize");

const { objDeepCopy, removeTimestamps } = require("../helpers/ObjectHelper");

const { Speakers } = require("../../data/model/Speakers");

const { Events } = require("../../data/model/Events");

const { User } = require("../../data/model/User");
const { Group } = require("../../data/model/Group");

const { EventTypes } = require("../../data/model/EventTypes");

const { logError, logInfo, log } = require("../helpers/Logger");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/login/logInConstants");

const { dateFromString } = require("../helpers/DateHelper");
const { findOne } = require("../helpers/QueryHelper");

const { areAnyUndefined } = require("../helpers/ListHelper");

const {
    EVENT_ALREADY_EXISTS_ERR_LBL,
    EVENT_WITH_NO_CAPACITY_ERR_LBL,
    MISSING_EVENT_ATTRIBUTE_ERR_LBL,
    EVENT_DOESNT_EXIST_ERR_LBL,
    EVENT_CREATE_ERR_LBL
} = require("../../constants/events/eventsConstants");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../helpers/ResponseHelper");



const handleAddUserToGroup = async (req, res) => {
    const body = req.body;
    const group = await findOne(Group, { organizer_email: req.decodedToken.email });
    try {
        const response = await group.addUser(body.users)
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            return setErrorResponse("Alguno de los usuarios a agregar no existe", res, 400);
        } else {
            return setErrorResponse("Error al agregar usuarios al grupo", res, 400);
        }
    }
    logInfo(response);
    return setOkResponse("Usuarios agregados al grupo con exito", res);

}

const handleGetGroup = async (req, res) => {
    const group = await findOne(Group, { organizer_email: req.decodedToken.email },
        {
            model: User,
            attributes: ["email"]
        });
    return setOkResponse(removeTimestamps(group), res);

}

module.exports = {
    handleAddUserToGroup, handleGetGroup
};
