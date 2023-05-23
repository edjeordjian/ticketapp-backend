const { MAX_EVENT_CAPACITY } = require("../../constants/events/eventsConstants");

const { getSerializedEvent } = require("../../repository/EventRepository");

const { Op } = require("sequelize");

const { objDeepCopy } = require("../../helpers/ObjectHelper");

const { Speakers } = require("../../data/model/Speakers");

const {Event_EventType} = require("../../data/model/relationships/EvenTypeEventRelationship");

const { Events } = require("../../data/model/Events");

const { User } = require("../../data/model/User");

const { FAQ } = require("../../data/model/FAQ");

const { EventTypes } = require("../../data/model/EventTypes");

const { logError } = require("../../helpers/Logger");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/login/logInConstants");

const { dateFromString } = require("../../helpers/DateHelper");

const { areAnyUndefined } = require("../../helpers/ListHelper");

const { getDistanceFromLatLonInKm } = require("../../helpers/DistanceHelper");

const { verifyToken } = require("../authentication/FirebaseService");

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
} = require("../../helpers/ResponseHelper");

const { create, findOne, findAll, update } = require("../../helpers/QueryHelper");

const { OK_LBL } = require("../../constants/messages");

const Logger = require("../../helpers/Logger");

const { ATTENDEES_RELATION_NAME } = require("../../constants/dataConstants");

const { ORGANIZER_RELATION_NAME } = require("../../constants/dataConstants");

const { getHashOf } = require("../../helpers/StringHelper");

const { Attendances } = require("../../data/model/Attendances");

const { EVENT_ALREADY_BOOKED } = require("../../constants/events/eventsConstants");

const crypto = require("crypto");
const { getEventAttendancesStats } = require("../../repository/EventRepository");
const { IS_PRODUCTION } = require("../../constants/dataConstants");
const { FINISHED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { suspendGivenEvent } = require("./EventNotificationService");
const { UNSUSPENDED_EVENT_LBL } = require("../../constants/events/eventsConstants");
const { notifiyEventStatus } = require("./EventNotificationService");
const { SUSPENDED_EVENT_LBL } = require("../../constants/events/eventsConstants");
const { CANCELLED_EVENT_LBL } = require("../../constants/events/eventsConstants");
const { getUserWithEmail } = require("../login/LogInService");
const { getSortedByReportsWithDate } = require("./EventReportService");
const { getDateOnly } = require("../../helpers/DateHelper");
const { getUserId } = require("../authentication/FirebaseService");
const { DRAFT_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { INVALID_STATUS_ERR_LBL } = require("../../constants/login/logInConstants");
const { PUBLISHED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { SUSPENDED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { CANCELLED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { getStateId } = require("./EventStateService");
const { EVENT_TO_EVENT_STATE_RELATION_NAME } = require("../../constants/dataConstants");
const { EventState } = require("../../data/model/EventState");

const { notifyTomorrowEvents } = require("./EventNotificationService");

const { eventIncludes } = require("../../repository/EventRepository");

const { notifyEventChange } = require("./EventNotificationService");

const { notifyCancelledEvent } = require("./EventNotificationService");

const { INVALID_CODE_ERR_LBL } = require("../../constants/events/eventsConstants");

const { fullTrimString } = require("../../helpers/StringHelper");

const { GENERIC_ERROR_LBL } = require("../../constants/dataConstants");

const { getTicket } = require("../../repository/EventRepository");

const { EVENT_ALREADY_ASISTED } = require("../../constants/events/eventsConstants");

const { destroy } = require("../../helpers/QueryHelper");

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

    const stateName = body.status ? body.status : "Borrador";

    const stateId = await getStateId(stateName);

    if (! stateId) {
        return setErrorResponse(INVALID_STATUS_ERR_LBL, res);
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

        picture4_url: picture4Url,

        state_id: stateId
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
        consumer,
        admin,
        latitude,
        longitude,
        withReports,
        only_favourites
    } = req.query;

    let events;
    const get_favourites = Boolean(only_favourites);

    let userId = await getUserId(req);
    const include_favourites = {
        model: User,
        as: "FavouritedByUsers",
        where: {
          id: userId
        }
    }
    const favouriteInclude = get_favourites? [include_favourites]:[];
    const order = [
        ["date", "ASC"],
        ["time", "ASC"]
    ];

    const publishedId = await getStateId(PUBLISHED_STATUS_LBL);

    if (publishedId.error) {
        return setErrorResponse(publishedId.error, res);
    }

    if (value) {

        const valueToSearch = fullTrimString(value);

        events = await findAll(Events, {
            name: {
                [Op.iLike]: `%${valueToSearch}%`
            },

            capacity: {
                [Op.ne]: 0
            },

            state_id: {
                [Op.eq]: publishedId
            }
        },
            eventIncludes.concat(favouriteInclude),
            order
        );

        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
    }
    else if (tags) {

        const types_ids = tags.split(",");

        events = await findAll(Events,
            {
                capacity: {
                    [Op.ne]: 0
                },

                state_id: {
                    [Op.eq]: publishedId
                }
            },
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
                },
                {
                    model: EventState,
                    attributes: ["id", "name"],
                    as: EVENT_TO_EVENT_STATE_RELATION_NAME
                }
            ].concat(favouriteInclude),
            order
        );
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
    }
    else if (owner) {
        events = await findAll(Events, {
            owner_id: owner
        },
            eventIncludes.concat(favouriteInclude),
            order
        );
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
    }
    else if (staff) {
        const user = await findOne(User, {
            id: staff,
            is_staff: true
        });

        if (! user) {
            return setUnexpectedErrorResponse(UNEXISTING_USER_ERR_LBL, res);
        }
        
        if (user.error) {
            return setUnexpectedErrorResponse(user.error, res);
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
                },
                state_id: {
                    [Op.eq]: publishedId
                }
            },
            eventIncludes,
            order
        );
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
    }
    else if (consumer) {
        userId = await getUserId(req);
        Logger.logInfo("consumer");
        const user = await findOne(User,
            {
                id: consumer,
                is_consumer: true
            });

        if (! user) {
            return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
        }
        
        if (user.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }

        events = await user.getEvents({
                where: {
                    state_id: {
                        [Op.eq]: publishedId
                    }
                },
                include: eventIncludes.concat(favouriteInclude)
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
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
        
        userId = await getUserId(req);

        events = events.filter(e => {
            return ! getTicket(e, userId).wasUsed;
        });
    }
    else if (admin) {
        events = await findAll(Events,
            {},
            eventIncludes,
            order
        );
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }

        let startDate = req.query.startDate;

        let endDate = req.query.endDate;

        events.map(event => {
            event.reports = event.events_reports;
        });

        if (startDate && endDate) {
            startDate = new Date(startDate).toISOString();

            endDate = new Date(endDate).toISOString();

            events.map(event => {
                event.reports = event.events_reports.filter(report => {
                        const reportDate = getDateOnly(report.createdAt).toISOString();

                        return reportDate >= startDate && reportDate <= endDate;
                    }
                );
            });
        }

        events = events.filter(e => e.reports.length !== 0);

        events.sort((x1, x2) => {
            const a = x1.reports.length;

            const b = x2.reports.length;

            return b - a;
        });
    }
    else {
        Logger.logInfo(`published id ${publishedId}`);
        events = await findAll(Events,
            {
                capacity: {
                    [Op.ne]: 0
                },

                state_id: {
                    [Op.eq]: publishedId
                }
            },
            eventIncludes.concat(favouriteInclude),
            order
        );
        
        if (events.error) {
            return setUnexpectedErrorResponse(events.error, res);
        }
    }

    let serializedEvents = await Promise.all(events.map(async e => {
        return await getSerializedEvent(e, userId, withReports);
    }));

    if (latitude && longitude) {
        serializedEvents = serializedEvents.map(e => {
            return {
                ...e,
                distance: getDistanceFromLatLonInKm(latitude,
                                                    longitude,
                                                    e.latitude,
                                                    e.longitude)
            }
        });

        serializedEvents.sort((a, b) => a.distance - b.distance);
    }

    const eventsResponse = {
        events: serializedEvents
    };

    return setOkResponse(OK_LBL, res, eventsResponse);
};

const handleGet = async (req, res) => {
    const {
        eventId,
        withReports
    } = req.query;

    if (!eventId) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

    const event = await findOne(Events, {
        id: eventId
    },
        eventIncludes
    );

    if (event === null) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    } else if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const userId = await getUserId(req);

    const serializedEvent = await getSerializedEvent(event, userId, withReports);

    return setOkResponse(OK_LBL, res, serializedEvent);
};

const handleEventSignUp = async (req, res) => {
    const { eventId } = req.body;

    const event = await findOne(Events, {
        id: eventId
    },
        eventIncludes);

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
        eventIncludes);

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

const handleUpdateEvent = async (req, res) => {
    const body = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await verifyToken(token);    

    const user = await getUserWithEmail(decodedToken.email);

    if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const organizerId = user.id;

    const event = await findOne(Events, { 
        id: body.id, 
        owner_id: organizerId
    });

    const originalName = event.name;

    if (!event || event.error){
        return setErrorResponse("El evento seleccionado no existe o no coincide con el organizador", res);
    }
    
    if (body.faq !== undefined) {
        const faqs = [];
        await destroy(FAQ,{eventId: body.id});
        body.faq.map(async f => {
            const faqCreated = await create(FAQ, {
                eventId: body.id,
                question: f[0],
                answer: f[1]
            });
            if (faqCreated.error !== undefined) {
                throw new Error(faqCreated.error);
            }
            faqs.push(objDeepCopy(faqCreated));

        });
        const createResponse = await event.addFAQs(faqs);

        if (createResponse.error !== undefined) {
            throw new Error(createResponse.error);
        }
        delete body.faq;
    }
    let wallpaperUrl, picture1Url, picture2Url, picture3Url,
        picture4Url;

    let fieldsToUpdate = body;

    if (body.status) {
        fieldsToUpdate.state_id = await getStateId(body.status);
    }

    if (body.pictures  && body.pictures.length > 0) {
        wallpaperUrl = body.pictures[0];
        
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
            delete fieldsToUpdate.pictures;
            fieldsToUpdate = {
                ...fieldsToUpdate,
                wallpaper_url: wallpaperUrl,
        
                picture1_url: picture1Url,
        
                picture2_url: picture2Url,
        
                picture3_url: picture3Url,

                picture4_url: picture4Url
            }
    }
    if (body.agenda){
        let speakers = [];
        await destroy(Speakers, {eventId: body.id});
        body.agenda.map(async speaker => {
            const createResponse = await create(Speakers, {
                start: speaker.start,
                end: speaker.end,
                title: speaker.title,
                eventId: body.id
            });
            if (createResponse.error !== undefined) {
                throw new Error(createResponse.error);
            }

            speakers.push(objDeepCopy(createResponse));
        });

        const createResponse = await event.addSpeakers(speakers);
        delete fieldsToUpdate.agenda;
    }
    if (body.types){
        await destroy(Event_EventType, {eventId: body.id});
        const tagsToAdd = await findAll(EventTypes, {
            id: body.types
        });
        await event.addEvent_types(tagsToAdd);
        delete fieldsToUpdate.types;
    }
    if(fieldsToUpdate.date){
        fieldsToUpdate.date = dateFromString(body.date);
    }
    if(fieldsToUpdate.time){
        fieldsToUpdate.time = dateFromString(body.time);
    }
    const response  = await update(Events,
        fieldsToUpdate,
        {
            id: body.id
        });

    if (response.error) {
        return setUnexpectedErrorResponse(response.error);
    }

    if (body.sendNotification) {
        const updatedEvent = await findOne(Events,
            {
                id: body.id
            },
            eventIncludes);

        if (updatedEvent.error) {
            return setUnexpectedErrorResponse(updatedEvent.error, res);
        }

        const notificationResponse = await notifyEventChange(updatedEvent,
            originalName);

        if (notificationResponse.error) {
            return setUnexpectedErrorResponse(notificationResponse.error, res);
        }
    }

    return setOkResponse("Evento actualizado correctamente",res);
}

const suspendEvent = async (req, res) => {
    const body = req.body;

    const event = await findOne(Events, {
            id: body.eventId
        },
        eventIncludes);

    if (! event) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

    if (event.error) {
        return setErrorResponse(event.error, res);
    }

    const label = await suspendGivenEvent(event, body.suspend);

    if (label.error) {
        return setUnexpectedErrorResponse(label.error, res);
    }

    return setOkResponse(label.message, res);
}

const cancelEvent = async (req, res) => {
    const body = req.body;

    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = await verifyToken(token);

    const user = await getUserWithEmail(decodedToken.email);

    if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const organizerId = user.id;

    const event = await findOne(Events, {
        id: body.eventId,
        owner_id: organizerId
    },
        eventIncludes);

    if (! event){
        return setErrorResponse("El evento seleccionado no existe o no coincide con el organizador", res);
    }

    if (event.error) {
        return setErrorResponse(event.error, res);
    }

    let stateId;

    const draftStateId = await getStateId(DRAFT_STATUS_LBL);

    if (event.state_id === draftStateId) {
        const result = await destroy(Events, {
            id: event.id
        });

        if (result.error) {
            return setUnexpectedErrorResponse(result.error, res);
        }

        return setOkResponse(OK_LBL, res);
    }

    stateId = await getStateId(CANCELLED_STATUS_LBL);

    if (stateId.error) {
        return setErrorResponse(stateId.error, res);
    }

    const updateResult = await update(Events,
        {
            state_id: stateId
        },
        {
            id: body.eventId,
            owner_id: organizerId
        });

    if (updateResult.error) {
        return setErrorResponse(updateResult.error, res);
    }

    const notificationResponse = await notifiyEventStatus(event, CANCELLED_EVENT_LBL);

    if (notificationResponse.error) {
        return setUnexpectedErrorResponse(notificationResponse.error, res);
    }

    return setOkResponse(OK_LBL, res);
}

const cronEventUpdate = async () => {
    const now = new Date();

    if (IS_PRODUCTION) {
        now.setHours(now.getHours() - 3);
    }

    now.setUTCSeconds(0);

    now.setUTCMilliseconds(0);

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // - 1 day

    yesterday.setUTCHours(3);

    yesterday.setUTCMinutes(0);

    if (IS_PRODUCTION) {
        yesterday.setHours(0);
    }

    let adaptedNow = new Date(now.getTime());

    adaptedNow.setUTCFullYear(2020);

    adaptedNow.setUTCMonth(0);

    adaptedNow.setUTCDate(1);

    const publishedId = await getStateId(PUBLISHED_STATUS_LBL);

    let eventsToFinish = await findAll(Events,
        {
            date: yesterday,

            time: adaptedNow,

            state_id: {
                [Op.eq]: [publishedId],
            }
        },
        eventIncludes
    );

    if (eventsToFinish.error) {
        return eventsToFinish.error;
    }

    const eventsToFinishIds = eventsToFinish.map(e => e.id);

    const finishedId = await getStateId(FINISHED_STATUS_LBL);

    const updateResult = await update(Events, {
        state_id: finishedId
    }, {
        id: {
            [Op.in]: eventsToFinishIds
        }
    });

    if (updateResult.error) {
        return updateResult.error;
    }

    await notifyTomorrowEvents();
}

const getAttendancesStats = async (req, res) => {
    const {eventId} = req.query;

    const event = await findOne(Events,
        {
            id: eventId
        },
        [
            {
                model: User,
                attributes: ["id", "email"],
                as: ATTENDEES_RELATION_NAME
            }
        ]);

    if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const stats = getEventAttendancesStats(event);

    const response = {
        stats: stats
    }

    return setOkResponse(OK_LBL, res, response);
}

module.exports = {
    handleCreate,
    handleGet,
    handleSearch,
    handleEventSignUp,
    handleEventCheck,
    handleUpdateEvent,
    cancelEvent,
    cronEventUpdate,
    suspendEvent,
    getAttendancesStats
};
