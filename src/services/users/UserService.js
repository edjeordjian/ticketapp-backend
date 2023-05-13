const { CREATED_EVENTS_RELATION_NAME } = require("../../constants/dataConstants");
const { ORGANIZER_RELATION_NAME } = require("../../constants/dataConstants");
const { getDateOnly } = require("../../helpers/DateHelper");
const { logError } = require("../../helpers/Logger");
const { verifyToken } = require("../authentication/FirebaseService");
const { Events } = require("../../data/model/Events");

const { setOkResponse } = require("../../helpers/ResponseHelper");
const { OK_LBL } = require("../../constants/messages");
const { getSerializedUserWithReports } = require("../../repository/UserRepository");

const { EventReportCategory } = require("../../data/model/EventReportCategory");

const {
    EVENTS_REPORT_RELATION_NAME,
    REPORTS_RELATION_NAME
} = require("../../constants/dataConstants");

const { EventReport } = require("../../data/model/EventReport");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/events/eventsConstants");

const {
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const {
    findOne,
    findAll
} = require("../../helpers/QueryHelper");

const { User } = require("../../data/model/User");

const userIsOrganizer = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_organizer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_organizer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }
    return user;
}

const userIsAdministrator = async (decodedToken) => {
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
        return false;
    }

    const user = await findOne(User,
        {
            email: decodedToken.email,
            is_administrator: true
        }
    );

    if (! user || user.error) {
        logError(user.error);

        return false;
    }

    return true;
}

const userIsConsumer = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_consumer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_consumer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userIsStaff = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_staff: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_staff: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userExists = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const getUserWithEmail = async(userEmail) => {
    const user = await findOne(User, {
        email: userEmail
    });

    if (! user) {
        return {
            error: UNEXISTING_USER_ERR_LBL
        }
    }

    return user;
}

const getUsers = async (req, res) => {
    let users = await findAll(User,
        {
        },
        [
            {
                model: EventReport,
                attributes: ["text", "createdAt"],
                as: REPORTS_RELATION_NAME,
                include: [
                    {
                        model: Events,
                        as: EVENTS_REPORT_RELATION_NAME
                    },
                    {
                        model: EventReportCategory
                    }
                ]
            },
            {
                model: Events,
                as: CREATED_EVENTS_RELATION_NAME
            }
        ]
        );

    if (users.error) {
        return setUnexpectedErrorResponse(users.error, res);
    }

    let startDate = req.query.startDate;

    let endDate = req.query.endDate;

    if (startDate && endDate) {
        startDate = new Date(startDate).toISOString();

        endDate = new Date(endDate).toISOString();

        users.map(user => {
            user.reports = user.reports.filter(report => {
                    const reportDate = getDateOnly(report.createdAt).toISOString()

                    return reportDate >= startDate && reportDate <= endDate;
                }
            );
        });
    }

    users.sort((user1, user2) => {
        const a = user1.reports ? user1.reports.length : 0;

        const b = user2.reports ? user2.reports.length : 0;

        return a - b;
    })

    const serializedUsers = await Promise.all(
        users.map(async user => await getSerializedUserWithReports(user))
    );

    const responseBody = {
        list: serializedUsers
    }

    return setOkResponse(OK_LBL, res, responseBody);
}

module.exports = {
    userIsOrganizer, userExists, userIsConsumer, userIsStaff,
    userIsAdministrator, getUserWithEmail, getUsers
};
