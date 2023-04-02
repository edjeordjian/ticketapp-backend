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

const dateToString = (aDate) => {
    return aDate.toLocaleDateString('es-AR',
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
}

module.exports = {
    getQuickDate, dateFromString, dateToString
};
