const { MAX_EVENT_CAPACITY } = require("../../constants/events/eventsConstants");

const { getSerializedEventType } = require("../../data/model/EventTypes");

const { getSerializedEvent } = require("../../data/model/Events");

const { Op } = require("sequelize");

const { objDeepCopy } = require("../helpers/ObjectHelper");

const { Speakers } = require("../../data/model/Speakers");

const { Events } = require("../../data/model/Events");

const { User } = require("../../data/model/User");

const { EventTypes } = require("../../data/model/EventTypes");

const { logError } = require("../helpers/Logger");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/login/logInConstants");

const { dateFromString } = require("../helpers/DateHelper");

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

const { create, findOne, findAll } = require("../helpers/QueryHelper");

const { OK_LBL } = require("../../constants/messages");

const Logger = require("../../services/helpers/Logger");
const { getHashOf } = require("../helpers/StringHelper");
const { Attendances } = require("../../data/model/Attendances");
const { EVENT_ALREADY_BOOKED } = require("../../constants/events/eventsConstants");

const includes = [
    {
        model: Speakers,
        attributes: ["start", "end", "title"]
    },
    {
        model: EventTypes,
        attributes: ["id", "name"]
    },
    {
        model: User,
        attributes: ["first_name", "last_name"]
    }
];

const getAttendanceId = () => {
    const base = crypto.randomBytes(20).toString("hex");

    return getHashOf(base);
}

const handleCreate = async (req, res) => {
    const body = req.body;

    const findResponse = await findOne(Events, {
        name: body.name
    });

    if (findResponse !== null) {
        return setErrorResponse(EVENT_ALREADY_EXISTS_ERR_LBL, res);
    }
    if (findResponse !== null && "error" in findResponse) {
        return setUnexpectedErrorResponse(findResponse.error, res);
    }

    body.capacity = parseInt(body.capacity);

    if (isNaN(body.capacity) || body.capacity <= 0 || body.capacity >=
        MAX_EVENT_CAPACITY) {
        return setErrorResponse(EVENT_WITH_NO_CAPACITY_ERR_LBL, res);
    }

    if (areAnyUndefined([body.name,
        body.ownerId,
        body.description,
        body.capacity,
        body.date,
        body.time,
        body.types,
        body.address])) {
        return setErrorResponse(MISSING_EVENT_ATTRIBUTE_ERR_LBL, res);
    }

    const userFindResponse = await findOne(User, {
        id: body.ownerId
    });

    if (userFindResponse === null) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    }
    const tagsToAdd = await findAll(EventTypes, {
        id: body.types
    });
    let wallpaperUrl, picture1Url, picture2Url, picture3Url,
        picture4Url;

    if (body.pictures.length > 0) {
        wallpaperUrl = body.pictures[0];
    }

    if (body.pictures.length > 1) {
        picture1Url = body.pictures[1];
    }

    if (body.pictures.length > 2) {
        picture2Url = body.pictures[2];
    }

    if (body.pictures.length > 3) {
        picture3Url = body.pictures[3];
    }

    if (body.pictures.length > 4) {
        picture4Url = body.pictures[4];
    }

    return await create(Events, {
        owner_id: body.ownerId,

        name: body.name,

        description: body.description,

        capacity: body.capacity,

        address: body.address,

        latitude: body.latitude,

        longitude: body.longitude,

        date: dateFromString(body.date),

        time: dateFromString(body.time),

        wallpaper_url: wallpaperUrl,

        picture1_url: picture1Url,

        picture2_url: picture2Url,

        picture3_url: picture3Url,

        picture4_url: picture4Url
    }).then(async createdEvent => {
        const createResponse = await createdEvent.addEvent_types(tagsToAdd);

        if (createResponse.error !== undefined) {
            throw new Error(createResponse.error);
        }

        const speakers = [];

        if (body.agenda !== undefined) {
            body.agenda.map(async speaker => {
                const createResponse = await create(Speakers, {
                    start: speaker.start,
                    end: speaker.end,
                    title: speaker.title,
                    eventId: createdEvent.id
                });

                if (createResponse.error !== undefined) {
                    throw new Error(createResponse.error);
                }

                speakers.push(objDeepCopy(createResponse));
            });

            const createResponse = await createdEvent.addSpeakers(speakers);

            if (createResponse.error !== undefined) {
                throw new Error(createResponse.error);
            }
        }

        return setOkResponse(OK_LBL, res, {});
    }).catch(err => {
        logError(err);

        return setUnexpectedErrorResponse(EVENT_CREATE_ERR_LBL, res);
    });
};

const handleSearch = async (req, res) => {
    const { value, owner } = req.query;

    let events;

    const order = [["createdAt", "DESC"]];

    if (value) {
        events = await findAll(Events, {
                name: {
                    [Op.iLike]: `%${value}%`
                }
            },
            includes,
            order
        );
    } else if (owner) {
        events = await findAll(Events, {
                owner_id: owner
            },
            includes,
            order
        );
    } else {
        events = await findAll(Events,
            {
                id: {
                    [Op.ne]: null
                }
            },
            includes,
            order
        );
    }

    if (events.error) {
        return setUnexpectedErrorResponse(events.error, res);
    }

    const serializedEvents = await Promise.all(events.map(async e => {
        return getSerializedEvent(e);
    }));

    const eventsResponse = {
        events: serializedEvents
    };

    return setOkResponse(OK_LBL, res, eventsResponse);
};

const handleGet = async (req, res) => {
    const { userId, eventId } = req.query;

    if (!eventId) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

    const event = await findOne(Events, {
            id: eventId
        },
        includes
    );

    if (event === null) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const serializedEvent = await getSerializedEvent(event);

    const attendance = await findOne(Attendances,
        {
            userId: userId,

            eventId: eventId
        },
        [{
            model: Event
        }]
    );

    if (attendance) {
        serializedEvent.ticket = {
            id: attendance.hash_code,
            wasUsed: attendance.attended
        }
    } else if (attendance.error) {
        return setUnexpectedErrorResponse(attendance.error, res);
    }

    return setOkResponse(OK_LBL, res, serializedEvent);
};

const handleGetTypes = async (req, res) => {
    let result = await findAll(EventTypes,
        {
            id: {
                [Op.ne]: null
            }
        });

    if (result === null) {
        result = [];
    } else if (result.error) {
        return setErrorResponse(result.error, res);
    }

    const eventTypes = [];

    result.forEach(e => eventTypes.push(getSerializedEventType(e)));

    const response = {
        "event_types": eventTypes
    };

    return setOkResponse(OK_LBL, res, response);
};

const handleEventSignUp = async (req, res) => {
    const {userId, eventId} = req.body;

    const event = await findOne(Events, {
        id: eventId
    });

    if (! event) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const user = await findOne(User, {
        id: userId
    });

    if (! user) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    } else if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const attendances = await findOne(Attendances,
        {
            userId: user.id,

            eventId: event.id
        },
        [{
            model: Event
        }]
    );

    if (attendances.error) {
        return setUnexpectedErrorResponse(attendances.error, res);
    }

    if (attendances) {
        return setErrorResponse(EVENT_ALREADY_BOOKED, res);
    }

    user.addEvent(event, {
        hash_code: getAttendanceId()
    });

    return setOkResponse(OK_LBL, res, {});
}

module.exports = {
    handleCreate,
    handleGet,
    handleSearch,
    handleGetTypes,
    handleEventSignUp
};
