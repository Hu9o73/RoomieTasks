import { Sequelize } from 'sequelize';

require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,              // MySQL server
    dialect: 'mysql',                       // Database dialect
    database: process.env.DB_DATABASE,      // Database name
    username: process.env.DB_USER,          // Database username (should be a MySQL user)
    password: process.env.DB_PASSWORD,      // Database password (/user password)
    logging: false                          // Disable logging SQL queries to console (optional)
});

export default sequelize;
