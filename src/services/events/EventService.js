const { MAX_EVENT_CAPACITY } = require("../../constants/events/eventsConstants");

const { getSerializedEventType } = require("../../data/model/EventTypes");

const { getSerializedEvent } = require("../../data/model/Events");

const { Op } = require("sequelize");

const { objDeepCopy } = require("../helpers/ObjectHelper");

const { Speakers } = require("../../data/model/Speakers");

const { Events } = require("../../data/model/Events");

const { User } = require("../../data/model/User");
const { FAQ } = require("../../data/model/FAQ");

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

const { create, findOne, findAll, update } = require("../helpers/QueryHelper");

const { OK_LBL } = require("../../constants/messages");

const Logger = require("../../services/helpers/Logger");
const { ATTENDEES_RELATION_NAME } = require("../../constants/dataConstants");
const { ORGANIZER_RELATION_NAME } = require("../../constants/dataConstants");
const { getHashOf } = require("../helpers/StringHelper");
const { Attendances } = require("../../data/model/Attendances");
const { EVENT_ALREADY_BOOKED } = require("../../constants/events/eventsConstants");
const crypto = require("crypto");
const { INVALID_CODE_ERR_LBL } = require("../../constants/events/eventsConstants");
const { fullTrimString } = require("../helpers/StringHelper");
const { GENERIC_ERROR_LBL } = require("../../constants/dataConstants");
const { getTicket } = require("../../data/model/Events");
const { USER_NOT_REGISTERED } = require("../../constants/events/eventsConstants");
const { EVENT_ALREADY_ASISTED } = require("../../constants/events/eventsConstants");
const { getUserId } = require("../../routes/Middleware");

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
        attributes: ["first_name", "last_name"],
        as: ORGANIZER_RELATION_NAME
    },
    {
        model: User,
        attributes: ["id"],
        as: ATTENDEES_RELATION_NAME
    },
    {
        model: FAQ,
        attributes: ["question", "answer"],
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

    if (findResponse) {
        if (findResponse.error) {
            return setUnexpectedErrorResponse(findResponse.error, res);
        }

        return setErrorResponse(EVENT_ALREADY_EXISTS_ERR_LBL, res);
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
        const faqs = [];

        if (body.faq !== undefined) {
            body.faq.map(async f => {
                const faqCreated = await create(FAQ, {
                    eventId: createdEvent.id,
                    question: f[0],
                    answer: f[1]
                });
                if (faqCreated.error !== undefined) {
                    throw new Error(faqCreated.error);
                }
                faqs.push(objDeepCopy(faqCreated));

            });
            const createResponse = await createdEvent.addFAQs(faqs);

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
    const {
        value,
        tags,
        owner,
        staff,
        consumer
    } = req.query;

    let events;

    let userId = null;

    const order = [
        ["date", "ASC"],
        ["time", "ASC"]
    ];

    if (value) {
        userId = await getUserId(req);

        const valueToSearch = fullTrimString(value);

        events = await findAll(Events, {
            name: {
                [Op.iLike]: `%${valueToSearch}%`
            },
                capacity: {
                    [Op.ne]: 0
                }
        },
            includes,
            order
        );
    } else if (tags) {
        userId = await getUserId(req);

        const types_ids = tags.split(",");

        events = await findAll(Events,
            {},
            [
                {
                    model: Speakers,
                    attributes: ["start", "end", "title"]
                },
                {
                    model: EventTypes,
                    attributes: ["id", "name"],
                    where: {
                        id: {
                            [Op.in]: types_ids
                        }
                    }
                },
                {
                    model: User,
                    attributes: ["first_name", "last_name"],
                    as: ORGANIZER_RELATION_NAME
                },
                {
                    model: User,
                    attributes: ["id"],
                    as: ATTENDEES_RELATION_NAME
                },
                {
                    model: FAQ,
                    attributes: ["question", "answer"],
                }
            ],
            order
        );
    } else if (owner) {
        events = await findAll(Events, {
            owner_id: owner
        },
            includes,
            order
        );
    } else if (staff) {
        const user = await findOne(User, {
            id: staff,
            is_staff: true
        });

        if (! user) {
            return setUnexpectedErrorResponse(UNEXISTING_USER_ERR_LBL, res);
        }

        const groups = await user.getGroups();

        const owner_emails = groups.map(group => {
            return group.organizer_email
        });

        const owners = await findAll(User, {
            email: {
                [Op.in]: owner_emails
            }
        });

        if (owners.error) {
            return setUnexpectedErrorResponse(owner.error, res);
        }

        const owners_ids = owners.map(owner => {
            return owner.id
        });

        events = await findAll(Events,
            {
                owner_id: {
                    [Op.in]: owners_ids
                }
            },
            includes,
            order
        );
    } else if (consumer) {
        userId = await getUserId(req);

        const user = await findOne(User,
            {
                id: consumer,
                is_consumer: true
            });

        if (! user) {
            return setUnexpectedErrorResponse(UNEXISTING_USER_ERR_LBL, res);
        }

        events = await user.getEvents({
                include: includes
            })
            .then(events =>
                events.filter(e => {
                    return ! getTicket(e).wasUsed;
                }))
            .catch(err => {
                console.log(err);

                return {
                    "error": GENERIC_ERROR_LBL
                }
            });
    } else {
        userId = await getUserId(req);

        events = await findAll(Events,
            {
                capacity: {
                    [Op.ne]: 0
                }
            },
            includes,
            order
        );

        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }

        events = events.filter(e => {
            return ! getTicket(e).wasUsed;
        })
    }

    if (events.error) {
        return setUnexpectedErrorResponse(events.error, res);
    }

    const serializedEvents = await Promise.all(events.map(async e => {
        return getSerializedEvent(e, userId);
    }));

    const eventsResponse = {
        events: serializedEvents
    };

    return setOkResponse(OK_LBL, res, eventsResponse);
};

const handleGet = async (req, res) => {
    const { eventId } = req.query;

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

    const userId = await getUserId(req);

    const serializedEvent = await getSerializedEvent(event, userId);

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
    const { eventId } = req.body;

    const event = await findOne(Events, {
        id: eventId
    },
        includes);

    if (!event) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const userId = await getUserId(req);

    const user = await findOne(User, {
        id: userId,
        is_consumer: true
    });

    if (!user) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    } else if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    if (event.attendees.filter(attendee => attendee.id === userId).length > 0) {
        return setErrorResponse(EVENT_ALREADY_BOOKED, res);
    }

    const hash_code = getAttendanceId();

    const updateResponse = await update(Events,
        {
            capacity: event.capacity - 1
        },
        {
            id: event.id
        });

    if (updateResponse.error) {
        return setErrorResponse(updateResponse.error, res);
    }

    user.addEvent(event, {
        through: {
            hash_code: hash_code
        }
    });

    const serializedEvent = await getSerializedEvent(event, userId);

    // Database is not synchronized yet, so we need to add it explicitely.
    serializedEvent.ticket = {
        id: hash_code,
        wasUsed: false
    }

    return setOkResponse(OK_LBL, res, serializedEvent);
}

const handleEventCheck = async (req, res) => {
    const { eventId, eventCode } = req.body;

    const event = await findOne(Events, {
            id: eventId
        },
        includes);

    if (!event) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const attendances = event.attendees
        .filter(attendee => attendee.attendances.hash_code === eventCode);

    if (! attendances || attendances.length === 0) {
        return setErrorResponse(INVALID_CODE_ERR_LBL, res);
    }

    const attendance = attendances[0].attendances;

    if (attendance.attended) {
        return setErrorResponse(EVENT_ALREADY_ASISTED, res);
    }

    const user = await findOne(User, {
        id: attendance.userId,
        is_consumer: true
    });

    if (!user) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    } else if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const updateResult = await update(Attendances,
                                     {
                                         attended: true
                                     },
                                     {
                                         eventId: event.id
                                     });

    if (updateResult.error) {
        return setErrorResponse(updateResult.error, res);
    }

    return setOkResponse(OK_LBL, res, {});
}

module.exports = {
    handleCreate,
    handleGet,
    handleSearch,
    handleGetTypes,
    handleEventSignUp,
    handleEventCheck
};
