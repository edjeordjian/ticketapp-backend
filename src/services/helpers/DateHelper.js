const getQuickDate = () => {
    return new Date().toISOString()
                     .substr(0, 10);
};

// https://stackoverflow.com/questions/5619202/parsing-a-string-to-a-date-in-javascript
const dateFromString = (strFullDate) => {
    const [strDate, strTime] = strFullDate.split("T");

    const [year, month, day] = strDate.split('-');

    const [hours, minutes, seconds] = strTime.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds);
}

module.exports = {
    getQuickDate, dateFromString
};
