import { Sequelize } from 'sequelize';

require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'taskdb',
    dialect: 'mysql',
    database: process.env.DB_DATABASE || 'taskdb',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    logging: false
});

export default sequelize;