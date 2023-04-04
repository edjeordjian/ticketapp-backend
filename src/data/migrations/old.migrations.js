/* Save here your old migrations.
*/

async function m2() {
    await queryInterface.addColumn(User.tableName,
        "is_administrator", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true },
            defaultValue: false
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "is_organizer", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true },
            defaultValue: false
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "is_consumer", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true },
            defaultValue: false
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "first_name", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "last_name", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "picture_url", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "ownerId", {
            type: Sequelize.STRING(ID_MAX_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.bulkInsert(EventTypes.tableName, [{
        name: "Música",
        createdAt: today,
        updatedAt: today
    },
        {
            name: "Deporte",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Artes visuales",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Salud",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Pasatiempos",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Negocios",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Gastronomía",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Charla",
            createdAt: today,
            updatedAt: today
        }]);
}

async function m1() {
    await queryInterface.addColumn(Users.tableName,
        'firstName', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Users.tableName,
        'lastName', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Users.tableName,
        'pictureUrl', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));
}