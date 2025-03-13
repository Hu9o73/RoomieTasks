import { Sequelize } from 'sequelize';

require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'userdb',
    dialect: 'mysql',
    database: process.env.DB_DATABASE || 'userdb',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    logging: false
});

export default sequelize;