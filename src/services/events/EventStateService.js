const { EVENT_STATE_ERR_LBL } = require("../../constants/events/eventsConstants");

const { EventState } = require("../../data/model/EventState");

const { findOne } = require("../../helpers/QueryHelper");

const getStateId = async (name) => {
    const state = await findOne(EventState, {
        name: name
    });

    if (! state) {
        return {
            error: EVENT_STATE_ERR_LBL
        }
    }

    if (state.error) {
        return state;
    }

    return state.id;
};

module.exports = {
    getStateId
};

