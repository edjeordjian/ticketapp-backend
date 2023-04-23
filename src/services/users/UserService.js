const { findOne } = require("../helpers/QueryHelper");
const { User } = require("../../data/model/User");

const userIsOrganizer = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_organizer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_organizer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }
    return user;
}

const userIsConsumer = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_consumer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_consumer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userIsStaff = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_staff: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_staff: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userExists = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

module.exports = {
    userIsOrganizer, userExists, userIsConsumer, userIsStaff
}