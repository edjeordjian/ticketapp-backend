class DateMock {
    constructor() {

    }

    toISOString() {
        return '2023-04-08T23:24:15.786Z';
    }

    getHours() {
        return 0;
    }

    getMinutes() {
        return 0;
    }

    toLocaleDateString(obj, obj2) {
        return "Sat Apr 08 2023 20:24:10 GMT-0300 (Argentina Standard Time)"
    }

    setUTCSeconds(a) {
        return;
    }

    setUTCHours(a) {
        return;
    }

    setUTCMilliseconds(a) {
        return;
    }

    setUTCMinutes(e) {
        return;
    }

    getTime(a) {
        return "5"
    }

    setUTCFullYear(e) {
        return;
    }

    setUTCMonth(e) {
        return;
    }

    setUTCDate(e) {
        return;
    }
}

module.exports = {
    DateMock
}