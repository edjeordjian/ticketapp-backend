const {defineEventList} = require("../model/SpeakerEventRelationship");

const {defineEventTypeEventRelationship} = require("../model/EvenTypeEventRelationship");

const defineRelationships = () => {
    defineEventTypeEventRelationship();

    defineEventList();
}

module.exports = {
    defineRelationships
};
