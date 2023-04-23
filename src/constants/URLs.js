const FIREBASE_URL = "https://www.googleapis.com/userinfo/v2/me";

const BASE_URL = "/";

const SIGN_IN_URL = "/signin";

const EVENT_URL = "/event";

const EVENT_SEARCH_NAME_URL = "/event/all";

const EVENT_TYPES_URL = EVENT_URL + "/types";

const EVENT_GROUP_URL = EVENT_URL + "/group";

const EVENT_GROUP_ADD_USER_URL = EVENT_GROUP_URL + "/addUsers";

const EVENT_SIGN_UP_URL = "/event/signup"

const EVENT_CHECK_URL = "/event/check"

module.exports = {
    SIGN_IN_URL, BASE_URL, EVENT_URL, EVENT_SEARCH_NAME_URL,
    EVENT_TYPES_URL, FIREBASE_URL, EVENT_SIGN_UP_URL,
    EVENT_GROUP_URL, EVENT_GROUP_ADD_USER_URL, EVENT_CHECK_URL
};
