const {MAX_EVENT_CAPACITY} = require("../../constants/events/eventsConstants");
const {getSerializedEventType} = require("../../data/model/EventTypes");
const {getSerializedEvent} = require("../../data/model/Events");

const {Op} = require("sequelize");

const { objDeepCopy } = require("../helpers/ObjectHelper");

const { Speakers } = require("../../data/model/Speakers");

const { Events } = require("../../data/model/Events");

const { User } = require("../../data/model/User");

const { EventTypes } = require("../../data/model/EventTypes");

const { logError } = require("../helpers/Logger");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/login/logInConstants");

const { dateFromString } = require("../helpers/DateHelper");

const { areAnyUndefined } = require("../helpers/ListHelper");

const { EVENT_ALREADY_EXISTS_ERR_LBL,
        EVENT_WITH_NO_CAPACITY_ERR_LBL,
        MISSING_EVENT_ATTRIBUTE_ERR_LBL,
        EVENT_DOESNT_EXIST_ERR_LBL,
        EVENT_CREATE_ERR_LBL} = require("../../constants/events/eventsConstants");

const { setOkResponse,
        setErrorResponse,
        setUnexpectedErrorResponse } = require("../helpers/ResponseHelper");

const { create, findOne, findAll } = require("../helpers/QueryHelper");

const { OK_LBL } = require("../../constants/messages");

const handleCreate = async (req, res) => {
    const body = req.body;

    const findResponse = await findOne(Events, {
        name: body.name
    });

    if (findResponse !== null) {
        return setErrorResponse(EVENT_ALREADY_EXISTS_ERR_LBL, res);
    }

    body.capacity = parseInt(body.capacity);

    if (isNaN(body.capacity) || body.capacity <= 0 || body.capacity >= MAX_EVENT_CAPACITY) {
        return setErrorResponse(EVENT_WITH_NO_CAPACITY_ERR_LBL, res);
    }

    if (areAnyUndefined([body.name,
        body.ownerId,
        body.description,
        body.capacity,
        body.date,
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
                    description: speaker.description,
                    time: speaker.time,
                    eventId: createdEvent.id,
                });

                if (createResponse.error !== undefined) {
                    throw new Error(createResponse.error);
                }

                speakers.push(objDeepCopy(createResponse))
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
    const {value, owner} = req.query;

    let events;

    const includes =  [
        {
            model: Speakers,
            attributes: ["description", "time"]
        },
        {
            model: EventTypes,
            attributes: ["id"]
        }
    ];

    const order = [['createdAt', 'DESC']];

    if (value) {
        events = await findAll(Events, {
                name: {
                    [Op.like]: `%${value}%`
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

    const serializedEvents = [];

    events.map(e => {
       serializedEvents.push(getSerializedEvent(e));
    });

    const eventsResponse = {
        events: serializedEvents
    };

    return setOkResponse(OK_LBL, res, eventsResponse);
};

const handleGet = async (req, res) => {
    const { eventId } = req.query;

    if (! eventId) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

    const event = await findOne(Events, {
        id: eventId
    }, [
        {
            model: EventTypes,
            attributes: ['id']
        },
        {
            model: Speakers,
            attributes: ['description', 'time']
        }
    ]
    );

    if (event === null) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    return setOkResponse(OK_LBL, res, getSerializedEvent(event));
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
    }

    return setOkResponse(OK_LBL, res, response);
}

module.exports = {
    handleCreate,
    handleGet,
    handleSearch,
    handleGetTypes
};
