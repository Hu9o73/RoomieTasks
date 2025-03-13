import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';

interface TaskAttributes {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: string; // 'low', 'medium', 'high'
    status: string; // 'pending', 'completed'
    recurring: string; // 'one-time', 'daily', 'weekly', 'monthly'
    householdId: number;
    createdBy: number;
    assignedTo: number;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> { }

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public dueDate!: Date;
    public priority!: string;
    public status!: string;
    public recurring!: string;
    public householdId!: number;
    public createdBy!: number;
    public assignedTo!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
            defaultValue: 'medium',
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        recurring: {
            type: DataTypes.ENUM('one-time', 'daily', 'weekly', 'monthly'),
            allowNull: false,
            defaultValue: 'one-time',
        },
        householdId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        modelName: 'Task',
        timestamps: true
    }
);

export default Task;