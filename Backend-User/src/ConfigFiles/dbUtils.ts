import { Sequelize } from 'sequelize';

export async function testDatabaseConnection(sequelize: Sequelize) {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully to the database.')
        })
        .catch((error) => {
            console.log('Connection to the database failed with error : ', error)
        });

}