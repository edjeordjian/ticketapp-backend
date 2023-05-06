const { JSON_HEADER } = require("../constants/generalConstants");

const { EXPO_NOTIFICATIONS_URL } = require("../constants/URLs");

const { logError, logInfo } = require("./Logger");

const fetch = require('node-fetch');


const SendNotification = (body) => {
    return fetch(EXPO_NOTIFICATIONS_URL,{
        method: 'POST',
        headers: JSON_HEADER,
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then( async res => {
            logInfo("Notification answer: " + JSON.stringify(res) );

            return res;
        } )
        .catch( async err => {
            logError( "Notification error: " + err );

            return {
                error: err
            };
        } );
}

module.exports = {
    SendNotification
};
