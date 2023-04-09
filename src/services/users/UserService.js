
const { create, findOne, findAll } = require("../helpers/QueryHelper");
const { User } = require("../../data/model/User");


const userIsOrganizer = async (email) => {
    const user = await findOne(User,
        {
            email: email,
            is_organizer: true
        }
    );
    if (user === null || user.error) {
        return false;
    }
    return user;
}
const userExists = async (email) => {
    const user = await findOne(User,
        {
            email: email,
        }
    );
    if (user === null || user.error) {
        return false;
    }
    return user;
}

module.exports = {
    userIsOrganizer, userExists
}