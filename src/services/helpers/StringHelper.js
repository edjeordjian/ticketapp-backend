const { BASE_SALT } = require("../../constants/dataConstants");

const bcrypt = require("bcrypt");

const crypto = require("crypto");

function replaceAll(str, toReplace, newStr) {
    return str.split(toReplace).join(newStr);
}

// Sync = blocks the event loop
function getBcryptOf(toHash) {
    return bcrypt.hashSync(toHash, BASE_SALT);
}

function getHashOf(toHash) {
    // Edge case: slashes cannot be used in URLs items.
    return replaceAll(getBcryptOf(toHash), "/", "a").split(".")[2].substring(0, 10);
}

module.exports = {
    getBcryptOf, getHashOf, replaceAll
};
