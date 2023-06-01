const { dateFromString } = require("../../helpers/DateHelper");
const { getDateOnly } = require("../../helpers/DateHelper");
const { EVENT_TO_EVENT_STATE_RELATION_NAME } = require("../../constants/dataConstants");

const { EventState } = require("../../data/model/EventState");

const {
    Op,
    Sequelize
} = require("sequelize");

const { WRONG_DATE_FORMAT_ERR_LBL } = require("../../constants/events/eventsConstants");

const { Events } = require("../../data/model/Events");

const {
    DRAFT_STATUS_LBL,
    SUSPENDED_STATUS_LBL,
    FINISHED_STATUS_LBL,
    PUBLISHED_STATUS_LBL,
    CANCELLED_STATUS_LBL
} = require("../../constants/events/EventStatusConstants");

const {
    findAll
} = require("../../helpers/QueryHelper");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const { OK_LBL } = require("../../constants/messages");


const getEventStatusStats = async (req, res) => {
    const {
        start,
        end
    } = req.query;

    const startDate = dateFromString(start);

    const endDate = dateFromString(end, true);

    if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const eventsResult = await findAll(Events,
        {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        {
            model: EventState,
            attributes: ["id", "name"],
            as: EVENT_TO_EVENT_STATE_RELATION_NAME
        });

    if (eventsResult.error) {
        return setUnexpectedErrorResponse(eventsResult.error, res);
    }

    const statusNames = [
        DRAFT_STATUS_LBL,
        SUSPENDED_STATUS_LBL,
        FINISHED_STATUS_LBL,
        PUBLISHED_STATUS_LBL,
        CANCELLED_STATUS_LBL
    ];

    const responseData = statusNames.map(status => {
        return {
            number: eventsResult.filter(event => event.state.name === status)
                                .length,

            status: status
        };
    });

    const response = {
        stats: responseData
    }

    return setOkResponse(OK_LBL, res, response);
}

module.exports = {
    getEventStatusStats
};
