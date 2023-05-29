const { IS_PRODUCTION } = require("../constants/dataConstants");
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

const addLeadingZero = (aTime) => {
    if (aTime.split(":")[1].length === 1) {
        return `${aTime.split(":")[0]}:0${aTime.split(":")[1]}`;
    }

    return aTime;
}

const getTimeFrequencies = (times) => {
    let labels = [];

    if (times.length === 0) {
        return labels;
    }

    const first = addLeadingZero(times.reduce((a,b) => a < b ? a : b));

    const last = addLeadingZero(times.reduce((a,b) => a > b ? a : b));

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

    if (deltaMinutes === 0) {
        deltaMinutes = 1;
    }

    let hours = Number(first.split(":")[0]);

    if (IS_PRODUCTION) {
        hours -= 3;
    }

    let currentMinutes = Number(first.split(":")[1]);

    let currentTime = `${hours}:${currentMinutes}`;

    for (let i = 1; i < 6; i += 1) {
        addLeadingZero(currentTime);

        labels.push(currentTime);

        currentTime = getNextCurrentTime(currentMinutes,
                                         hours,
                                         deltaMinutes);

        currentMinutes = Number(currentTime.split(":")[1]);
    }

    if (last > currentTime) {
        labels.push(last);
    } else {
        labels.push(addLeadingZero(currentTime));
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

    const dataList = [];

    for (const [key, value] of Object.entries(data)) {
        dataList.push(value);
    }

    return dataList;
}

module.exports = {
    getTimeFrequencies, getDataInBuckets
}