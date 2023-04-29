const { UNEXISTING_USER_ERR_LBL,
    MISSING_GROUP_ERR_LBL} = require("../../constants/events/eventsConstants");

const { OK_LBL } = require("../../constants/messages");

const { findAll } = require("../../helpers/QueryHelper");

const { Op } = require("sequelize");

const { User } = require("../../data/model/User");

const { Group } = require("../../data/model/Group");

const { findOne } = require("../../helpers/QueryHelper");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");


const handleAddUserToGroup = async (req, res) => {
    const body = req.body;

    if (!body.assistants || body.assistants.length === 0) {
        return setErrorResponse(MISSING_GROUP_ERR_LBL, res);
    }

    const group = await findOne(Group, {
        organizer_email: req.decodedToken.email
    });

    if (group.error) {
        return setUnexpectedErrorResponse(group.error, res);
    }

    const users = await findAll(User, {
        email: {
            [Op.in]: body.assistants
        }
    });

    if (users.error) {
        return setUnexpectedErrorResponse(users.error, res);
    }

    const ids = users.map(user => user.id);

    if (ids.length === 0) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res, 400);
    }

    try {
        const response = await group.addUser(ids);
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            return setErrorResponse(UNEXISTING_USER_ERR_LBL, res, 400);
        } else {
            return setUnexpectedErrorResponse("Error al agregar usuarios al grupo.", res);
        }
    }

    return setOkResponse("Usuarios agregados al grupo con exito", res);
}

const handleGetGroup = async (req, res) => {
    const group = await findOne(Group, { organizer_email: req.decodedToken.email },
        {
            model: User,
            attributes: ["first_name", "last_name"]
        });

    const members = group.users.map(user => {
        return `${user.first_name} ${user.last_name}`;
    });

    const response = {
        "members": members
    };

    return setOkResponse(OK_LBL, res, response);
}

module.exports = {
    handleAddUserToGroup, handleGetGroup
};
