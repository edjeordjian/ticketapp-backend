const Logger = require("../../helpers/Logger");

const express = require('express');

const {
    suspendEvent,
    cancelEvent,
} = require("../../services/events/EventService");

const {
    EVENT_CANCEL_URL,
    EVENT_REPORT,
    EVENT_SUSPEND_URL,
    REPORTS_CATEGORIES_URL,
    EVENT_CHECK_URL,
    EVENT_SIGN_UP_URL,
    EVENT_TYPES_URL,
    EVENT_GROUP_ADD_USER_URL,
    EVENT_GROUP_URL,
    EVENT_URL,
    EVENT_SEARCH_NAME_URL
} = require("../../constants/URLs");

const {
    administratorMiddleware,
    firebaseAuthMiddleware,
    emptyBodyMiddleware,
    isAllowedMiddleware,
    isOrganizerMiddleware
} = require("../authentication/Middleware");

const {
    handleAddUserToGroup,
    handleGetGroup
} = require("../../services/login/GroupService");

const {
    handleEventSignUp,
    handleEventCheck
} = require("../../services/events/EventService");

const {
    userIsConsumer,
    userIsStaff
} = require("../../services/users/UserService");

const {
    handleGetTypes,
    getReportCategories
} = require("../../services/events/EventCategoriesService");

const {handleCreateEventReport} = require("../../services/events/EventReportService");

const {
    handleAddFavourite,
    handleDeleteFavourite
} = require("../../services/events/EventsFavouritesService")

const {
    handleCreate,
    handleSearch,
    handleGet,
    handleUpdateEvent
} = require("../../services/events/EventService");

const {
    userIsOrganizer,
    userExists
} = require("../../services/users/UserService");

const router = express.Router();


router.use(EVENT_URL, async (req, res, next) => {
    await emptyBodyMiddleware(req, res, next);
}, async (req, res, next) => {
    await firebaseAuthMiddleware(req, res, next);
});

router.post(EVENT_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsOrganizer)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_URL}`);

        await handleCreate(req, res);
    });

router.post(EVENT_SIGN_UP_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsConsumer)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_SIGN_UP_URL}`);

        await handleEventSignUp(req, res);
    });

router.post(EVENT_CHECK_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsStaff)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_CHECK_URL}`);

        await handleEventCheck(req, res);
    });

router.get(EVENT_SEARCH_NAME_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_SEARCH_NAME_URL}`);

        await handleSearch(req, res);
    });

router.get(EVENT_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_URL}`);

        await handleGet(req, res);
    });

router.get(EVENT_TYPES_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_TYPES_URL}`);

        await handleGetTypes(req, res);
    });

router.get(REPORTS_CATEGORIES_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_TYPES_URL}`);

        await getReportCategories(req, res);
    });

router.post(EVENT_GROUP_ADD_USER_URL, async (req, res, next) => {
    await isOrganizerMiddleware(req, res, next) },
    async (req, res) => {
        Logger.request(`POST: /event/group/addUsers`);
        await handleAddUserToGroup(req, res);
    });

router.get(EVENT_GROUP_URL, async (req, res, next) => {
        await isOrganizerMiddleware(req, res, next)
    },
    async (req, res) => {
        Logger.request(`POST: /event/group`);

        await handleGetGroup(req, res);
    });

router.patch(EVENT_URL, async (req, res, next) => {
        await isOrganizerMiddleware(req, res, next)
    }, async (req, res) => {
        Logger.request(`PATCH: /event`);

        await handleUpdateEvent(req, res);
    });

router.post(EVENT_CANCEL_URL, async (req, res, next) => {
        await isOrganizerMiddleware(req, res, next)
    }, async (req, res) => {
        Logger.request(`POST: /event/cancel`);

        await cancelEvent(req, res);
    });

router.patch(EVENT_SUSPEND_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`PATCH: /event/suspend`);

    await suspendEvent(req, res);
});

router.post(EVENT_REPORT, async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsConsumer);
}, async (req, res) => {
    Logger.request(`POST /event/report`);
    await handleCreateEventReport(req,res);
});

router.post('/event/favourite', async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsConsumer);
}, async (req, res) => {
    Logger.request('POST /event/favourite');
    await handleAddFavourite(req,res);
});

router.delete('/event/favourite', async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsConsumer);
}, async (req, res) => {
    Logger.request('DELETE /event/favourite');
    await handleDeleteFavourite(req,res);
});

module.exports = router;
