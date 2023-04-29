const { Speakers } = require("../Speakers");

const { Events } = require("../Events");

const { Sequelize } = require("sequelize");

const { database } = require("../../database");


const defineEventSpeakerRelationship = () => {
    Events.hasMany(Speakers);
}

module.exports = {
    defineEventSpeakerRelationship
};

