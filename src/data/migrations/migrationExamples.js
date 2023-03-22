/* Hand-crafted way of running migrations.
   - These examples must be inside runMigrations(), in migrations.js.
*/


/* ================ EXAMPLE 1 ===================== */
/* await queryInterface.removeColumn(Users.tableName,
                              'isAdmin');
                   .catch(e => {
                    console.log(e);
                   } );
*/

/* ================ EXAMPLE 2 ===================== */
/* await queryInterface.changeColumn(Users.tableName,
  'walletId', {
    type: Sequelize.INTEGER,
    unique: true
  },)
  .catch(error => {
    console.log(error.toString());
  });
*/

/* ================ EXAMPLE 3 ===================== */
/* await queryInterface.addColumn(Song.tableName,
       'isBlocked', {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false
       }).catch(error => console.log(error.toString()));
*/

/* ================ EXAMPLE 4 ===================== */
/* await queryInterface.removeConstraint(Notifications.tableName, 'PRIMARY');
} */