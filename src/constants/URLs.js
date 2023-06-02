const FIREBASE_URL = "https://www.googleapis.com/userinfo/v2/me";

const EXPO_NOTIFICATIONS_URL = "https://exp.host/--/api/v2/push/send";

const BASE_URL = "/";

const SIGN_IN_URL = "/signin";

const EVENT_URL = "/event";

const EVENT_SEARCH_NAME_URL = "/event/all";

const EVENT_TYPES_URL = EVENT_URL + "/types";

const EVENT_GROUP_URL = EVENT_URL + "/group";

const EVENT_GROUP_ADD_USER_URL = EVENT_GROUP_URL + "/addUsers";

const EVENT_SIGN_UP_URL = "/event/signup"

const EVENT_CHECK_URL = "/event/check"

const EVENT_CANCEL_URL = `${EVENT_URL}/cancel`;

const EVENT_SUSPEND_URL = `${EVENT_URL}/suspend`;

const REPORTS_URL = "/reports";

const REPORTS_CATEGORIES_URL = REPORTS_URL + "/categories";

const EVENT_STATES = `${EVENT_URL}/states`;

const EVENT_REPORT = `/event/report`;

const USER_URL = "/user";

const USER_BLOCK_URL = `${USER_URL}/block`;

const USER_ALL = `${USER_URL}/all`;

const ATTENDANCES_STATS_URL = `${EVENT_URL}/attendances/stats`;

const ATTENDANCES_RANGE_URL = `${EVENT_URL}/attendances/range`;

const EVENT_CALENDAR_SCHEDULE_URL = `${EVENT_URL}/calendar/schedule`;

const EVENT_STATUS_URL = `${EVENT_URL}/status/stats`;

module.exports = {
    SIGN_IN_URL, BASE_URL, EVENT_URL, EVENT_SEARCH_NAME_URL,
    EVENT_TYPES_URL, FIREBASE_URL, EVENT_SIGN_UP_URL, EVENT_GROUP_URL,
    EVENT_GROUP_ADD_USER_URL, EVENT_CHECK_URL, EXPO_NOTIFICATIONS_URL, REPORTS_URL,
    REPORTS_CATEGORIES_URL, EVENT_STATES, EVENT_CANCEL_URL, EVENT_REPORT,
    USER_BLOCK_URL, USER_ALL, EVENT_SUSPEND_URL, ATTENDANCES_RANGE_URL,
    ATTENDANCES_STATS_URL, EVENT_CALENDAR_SCHEDULE_URL, EVENT_STATUS_URL
};
