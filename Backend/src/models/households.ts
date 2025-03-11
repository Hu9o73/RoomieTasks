import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';

interface HouseholdAttributes {
    id: number;
    name: string;
    inviteCode: string;
    ownerId: number;
}

interface HouseholdCreationAttributes extends Optional<HouseholdAttributes, 'id' | 'inviteCode'> { }

class Household extends Model<HouseholdAttributes, HouseholdCreationAttributes> implements HouseholdAttributes {
    public id!: number;
    public name!: string;
    public inviteCode!: string;
    public ownerId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Household.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        inviteCode: {
            type: DataTypes.STRING(8),
            allowNull: true,
            unique: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'households',
        modelName: 'Household',
        timestamps: true
    }
);

export default Household;