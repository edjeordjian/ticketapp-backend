const objDeepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

module.exports = {
    objDeepCopy
};
