/* Save here your old migrations.
*/

async function first() {
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