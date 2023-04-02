const { Speakers } = require("./Speakers");

const { Events } = require("./Events");
const { Sequelize } = require("sequelize");

const { database } = require("../database/database");


const defineEventSpeakerRelationship = () => {
    const Event_SpeakertRelationship = database.define("event_event_type", {
    });
    Events.hasMany(Speakers);
}



module.exports = {
    defineEventSpeakerRelationship
};

