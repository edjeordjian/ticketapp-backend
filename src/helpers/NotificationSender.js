import { EXPO_NOTIFICATIONS_URL } from "../constants/URLs";

import { JSON_HEADER } from "../constants/generalConstants";

import { logError, logInfo } from "./Logger";

const NotificationSender = (body) => {
    fetch(EXPO_NOTIFICATIONS_URL,{
        method: 'POST',
        headers: JSON_HEADER,
        body: JSON.stringify(body)

    })
        .then(res => res.json())
        .then( async res => {
            logInfo( "--- Push notification answer: " + JSON.stringify(res) );
        } )
        .catch( async err => {
            logError( "______ Push notification ERROR: " + err );
        } );
}

export {
    NotificationSender
};
