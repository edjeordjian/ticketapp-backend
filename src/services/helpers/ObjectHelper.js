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


module.exports = {
    objDeepCopy, isEmpty
};
