const getQuickDate = () => {
    return new Date().toISOString()
        .substr(0, 10);
};

// https://stackoverflow.com/questions/5619202/parsing-a-string-to-a-date-in-javascript
const dateFromString = (strFullDate, finalTime = false) => {
    let strDate, strTime;

    let hours, minutes, seconds;

    if (strFullDate.includes(":")) {
        strTime = `${strFullDate}:0`
    } else {
        [strDate, strTime] = strFullDate.split("T");
    }

    let year, month, day;

    if (strDate) {
        [year, month, day] = strDate.split('-');
    } else {
        year = "2020";

        month = "1";

        day = "1";
    }

    if (strTime) {
        [hours, minutes, seconds] = strTime.split(":");
    } else {
        hours = "0";

        minutes = "0";

        seconds = "0";
    }

    if (finalTime) {
        hours = "23";

        minutes = "59";

        seconds = "59";
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
};

const dateToString = (aDate) => {
    return aDate.toLocaleDateString('es-AR',
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
};

const getTimeStringFrom = (aDate) => {
    return aDate.toLocaleDateString('es-AR',
        {
            hour: 'numeric',
            minute: 'numeric'
        }).split(" ")[1];;
}

const timeToString = (aTime) => {
    let hours = aTime.getHours();

    let minutes = aTime.getMinutes();

    if (hours < 10) {
        hours = `0${hours}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return `${hours}:${minutes}`
};

const getDateOnly = (aDate) => {
    const anotherDate = new Date(aDate);

    // 0 hours in Argentina = + 3 hours in UTC / ISO date
    anotherDate.setHours(0);

    anotherDate.setMinutes(0);

    anotherDate.setSeconds(0);

    anotherDate.setMilliseconds(0);

    return anotherDate;
}

const dateToMomentFormat = (dateString) => {
    const [day, month, year] = dateString.split("/");

    return `${year}-${month}-${day}`;
}

const momentToHumanDateFormat = (dateString) => {
    const [year, month, day] = dateString.split("-");

    return `${day}/${month}/${year}`;
}

const timeToNumber = (timeStr) => {
    const [
        hours,
        minutes
    ] = timeStr.split(":");

    return Number(hours) * 100 + Number(minutes);
}

module.exports = {
    getQuickDate, dateFromString, dateToString, timeToString,
    getDateOnly, dateToMomentFormat, momentToHumanDateFormat, getTimeStringFrom,
    timeToNumber
};
