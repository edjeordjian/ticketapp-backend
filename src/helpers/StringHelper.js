const { BASE_SALT } = require("../constants/dataConstants");

const bcrypt = require("bcrypt");

const crypto = require("crypto");

function replaceAll(str, toReplace, newStr) {
    return str.split(toReplace).join(newStr);
}

function replaceAllBy(str, toReplace) {
    let toReturn = str;

    for (const key in toReplace) {
        toReturn = replaceAll(toReturn,
                              key,
                              toReplace[key]);
    }

    return toReturn;
}

function setCharAt(str, index, chr) {
    if(index > str.length-1) {
        return str;
    }

    return str.substring(0, index) + chr + str.substring(index + 1);
}

function fullTrimString(str) {
    const noA = replaceAll(str.toLowerCase(), "á", "a");

    const noE = replaceAll(noA, "é", "a");

    const noI = replaceAll(noE, "ú", "u");

    const noO = replaceAll(noI, "í", "i");

    return replaceAll(noO, "ó", "o");
}

// Sync = blocks the event loop
function getBcryptOf(toHash) {
    return bcrypt.hashSync(toHash, BASE_SALT);
}

function getHashOf(toHash) {
    const hash = getBcryptOf(toHash);

    // slashes cannot be used in URLs items.
    // l can be confused with I
    // o can be confuse with O
    // O can be confused with 0
    const conflicts = {
        "/": "a",
        "O": "b",
        "0": "c",
        "I": "d",
        "l": "e"
    }

    return replaceAllBy(hash, conflicts).split(".p5.")[1].substring(0, 10);
}

module.exports = {
    getBcryptOf, getHashOf, replaceAll, fullTrimString,
    replaceAllBy, setCharAt
};
