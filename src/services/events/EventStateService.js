const { EVENT_STATE_ERR_LBL } = require("../../constants/events/eventsConstants");

const { EventState } = require("../../data/model/EventState");

const { findOne } = require("../../helpers/QueryHelper");

const getCanceledStateId = async () => {
    return await getNameStateId("Cancelado");
}

const getSuspendedStateId = async () => {
    return await getNameStateId("Suspendido");
}

const getFinishedStateId = async () => {
    return await getNameStateId("Finalizado");
}

const getPublishedStateId = async () => {
    return await getNameStateId("Publicado");
}

const getNameStateId = async (name) => {
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
}

module.exports = {
    getCanceledStateId, getSuspendedStateId, getFinishedStateId,
    getPublishedStateId
};

