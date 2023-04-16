const objDeepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const isEmpty = (obj) => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

const removeTimestamps = (data) => {
    if (typeof data !== 'object' || data === null) {
        return data;
    }

    for (let key in data) {
        if (key === 'createdAt' || key === 'updatedAt') {
            delete data[key];
        } else {
            removeTimestamps(data[key]);
        }
    }

    return data;
}

module.exports = {
    objDeepCopy, isEmpty, removeTimestamps
};
