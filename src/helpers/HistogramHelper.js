const { timeToNumber } = require("./DateHelper");
const { dateFromString } = require("./DateHelper");
const getNextCurrentTime = (currentMinutes, hours, deltaMinutes) => {
    currentMinutes = currentMinutes + deltaMinutes;

    if (currentMinutes >= 60) {
        currentMinutes -= 60;

        hours += 1;
    }

    return `${hours}:${currentMinutes}`;
}

const getTimeFrequencies = (times) => {
    const first = times.reduce((a,b) => a < b ? a : b);

    const last = times.reduce((a,b) => a > b ? a : b);

    let labels = [];

    let deltaMinutes;

    if (first.split(":")[0] === last.split(":")[0]) {
        deltaMinutes = Math.ceil(
            (
                Number(`${last.split(":")[1]}`) - Number(`${first.split(":")[1]}`)
            ) / 10
        );
    } else {
        deltaMinutes = 30;
    }

    labels.push(first);

    let hours = Number(first.split(":")[0]);

    let currentMinutes = Number(first.split(":")[1]);

    let currentTime = `${hours}:${currentMinutes}`;

    for (let i = 1; i < 9; i += 1) {
        currentTime = getNextCurrentTime(currentMinutes,
                                         hours,
                                         deltaMinutes);

        currentMinutes = Number(currentTime.split(":")[1]);

        labels.push(currentTime);
    }

    if (last > currentTime) {
        labels.push(last);
    } else {
        labels.push(
            getNextCurrentTime(currentMinutes,
                               hours,
                               deltaMinutes)
        );
    }

    return labels;
}

const closestBucket = (aCase, labels) => {
    const aDateCase = timeToNumber(aCase);

    return labels.reduce((a, b) => {
        if (Math.abs(aDateCase - timeToNumber(b)) <
            Math.abs(aDateCase - timeToNumber(a))) {
            return b
        }

        return a
    });
}

const getDataInBuckets = (times, labels) => {
    const data = {};

    for (let label of labels) {
        data[label] = 0;
    }

    for (let time of times) {
        const label = closestBucket(time, labels);

        data[label] += 1;
    }

    return data;
}

module.exports = {
    getTimeFrequencies, getDataInBuckets
}