/* Save here your old migrations.
*/

const dataMigrations = async () => {
    await EventReportCategory.count()
        .then(async count => {
            if (count === 0) {
                await queryInterface.bulkInsert(EventReportCategory.tableName,
                    [{
                        name: "El evento parece ilegal o no cumple con nuestras políticas.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Es publicidad / Spam, no es un evento real.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Tiene contenido ofensivo, obsceno o discriminatorio.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Quiere cobrar un precio a un evento gratuito.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Otro",
                        createdAt: today,
                        updatedAt: today
                    }]);
            }
        }).catch(err => {
            console.log(err.toString());
        });


    await EventState.count()
        .then(async count => {
            if (count === 0) {
                await queryInterface.bulkInsert(EventState.tableName,
                    [{
                        name: "Borrador",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Publicado",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Cancelado",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Suspendido",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Finalizado",
                        createdAt: today,
                        updatedAt: today
                    }]);
            }
        }).catch(err => {
            console.log(err.toString());
        });

    await queryInterface.bulkInsert(EventTypes.tableName, [{
        name: "Evento deportivo",
        createdAt: today,
        updatedAt: today
    },
        {
            name: "Cena o gala",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Clase, curso o taller",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Concierto",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Performance",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Conferencia",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Encuentro",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Networking",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Feria",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Festival",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Fiesta",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Competencia",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Promoción",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Seminario",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Show",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Torneo",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Visita",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Otro",
            createdAt: today,
            updatedAt: today
        }
    ]);
}

async function m7() {
    await queryInterface.addColumn(Events.tableName,
        'total_capacity',
        {
            type: Sequelize.INTEGER
        }).catch(error => console.log(error.toString())
    );

    await queryInterface.addColumn(User.tableName,
        "is_blocked",
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true },
            defaultValue: false
        }).catch(err => {
        console.log(err.toString());
    });

    await queryInterface.addColumn(EventReport.tableName,
        "event_id",
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: { notEmpty: true }
        }).catch(err => {
        console.log(err.toString());
    });
}

async function m6() {
    await queryInterface.addColumn(Events.tableName,
        "state_id",
        {
            type: Sequelize.INTEGER
        }).catch(err => {
        console.log(err.toString());
    });

    await queryInterface.addColumn(EventReport.tableName,
        "reporter_id",
        {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(err => {
        console.log(err.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "expo_token",
        {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(err => {
        console.log(err.toString());
    });
}

async function m5() {
    await queryInterface.addColumn(Events.tableName,
        "latitude", {
            type: Sequelize.STRING(MAX_STR_LEN)
        }
    ).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Events.tableName,
        "longitude", {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));
}

async function m4() {
    await queryInterface.removeColumn(Speakers.tableName,
        'description')
    .catch(e => {
        console.log(e);
    } );


    await queryInterface.removeColumn(Speakers.tableName,
        'time')
    .catch(e => {
        console.log(e);
    } );


    await queryInterface.addColumn(Speakers.tableName,
        'title', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));


    await queryInterface.addColumn(Speakers.tableName,
        'start', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));


    await queryInterface.addColumn(Speakers.tableName,
        'end', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.removeColumn(User.tableName,
        '\"ownerId\"')
    .catch(e => {
        console.log(e);
    } );
}

async function m3() {
    await queryInterface.addColumn(Events.tableName,
        "time", {
            type: Sequelize.DATE
        }
    ).catch(error => {
        console.log(error.toString());
    });
}

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