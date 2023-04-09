
const { create, findOne, findAll } = require("../helpers/QueryHelper");
const { User } = require("../../data/model/User");


const userExists = async (email) => {
    const user = await findOne(User, { email: email });
    if (user === null || user.error) {
        return false;
    }
    return user;
}

module.exports = {
    userExists
}