const Logger = require("../helpers/Logger");

const express = require('express');
const { administratorMiddleware } = require("./Middleware");
const { EVENT_SUSPEND_URL } = require("../constants/URLs");
const { cancelEvent } = require("../services/events/EventService");
const { EVENT_CANCEL_URL, EVENT_REPORT } = require("../constants/URLs");
const { getReportCategories } = require("../services/events/EventCategoriesService");
const { REPORTS_CATEGORIES_URL } = require("../constants/URLs");
const { userIsStaff } = require("../services/users/UserService");
const { handleEventCheck } = require("../services/events/EventService");
const { EVENT_CHECK_URL } = require("../constants/URLs");
const { firebaseAuthMiddleware } = require("./Middleware");
const { emptyBodyMiddleware } = require("./Middleware");
const { isAllowedMiddleware } = require("./Middleware");
const { handleGetGroup } = require("../services/login/GroupService");
const { handleAddUserToGroup } = require("../services/login/GroupService");
const { isOrganizerMiddleware } = require("./Middleware");
const { EVENT_GROUP_URL } = require("../constants/URLs");
const { EVENT_GROUP_ADD_USER_URL } = require("../constants/URLs");
const { handleEventSignUp } = require("../services/events/EventService");
const { userIsConsumer } = require("../services/users/UserService");
const { EVENT_SIGN_UP_URL } = require("../constants/URLs");
const { handleGetTypes } = require("../services/events/EventCategoriesService");
const {handleCreateEventReport} = require("../services/events/EventReportService");

const { EVENT_TYPES_URL } = require("../constants/URLs");

const { handleCreate,
    handleSearch,
    handleGet, handleUpdateEvent } = require("../services/events/EventService");

const { userIsOrganizer, userExists } = require("../services/users/UserService");

const { EVENT_URL, EVENT_SEARCH_NAME_URL } = require("../constants/URLs");
const { async } = require("@firebase/util");

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

    await cancelEvent(req, res);
});

router.post(EVENT_REPORT, async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsConsumer);
}, async (req, res) => {
    Logger.request(`POST /event/report`);
    await handleCreateEventReport(req,res);
});

module.exports = router;
