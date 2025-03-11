import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';

interface UserAttributes {
    id: number;
    nickname: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    year: string;
    program: string;
    school: string;
    role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'nickname' | 'role'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public nickname!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public year!: string;
    public program!: string;
    public school!: string;
    public role!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        program: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize, // The Sequelize instance
        tableName: 'users',
        modelName: 'User',
        timestamps: true
    }
);

export default User;
