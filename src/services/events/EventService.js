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

    if (body.capacity <= 0) {
        return setErrorResponse(EVENT_WITH_NO_CAPACITY_ERR_LBL, res);
    }

    if (areAnyUndefined([body.name,
        body.ownerId,
        body.description,
        body.capacity,
        body.date,
        body.tags,
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
        id: body.tags
    });

    return await create(Events, {
        owner_id: body.ownerId,

        name: body.name,

        description: body.description,

        capacity: body.capacity,

        date: dateFromString(body.date),

        address: body.address,

        wallpaper_url: body.wallpaperUrl,

        picture1_url: body.picture1Url,

        picture2_url: body.picture2Url,

        picture3_url: body.picture3Url,

        picture4_url: body.picture4Url
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

    if (! value && ! owner) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

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
                    [Op.like]: `%${searchString}%`
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

module.exports = {
    handleCreate,
    handleGet,
    handleSearch
};
