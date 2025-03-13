import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';

interface HouseholdMemberAttributes {
    id: number;
    householdId: number;
    userId: number;
    role: string; // 'owner', 'admin', 'member'
}

interface HouseholdMemberCreationAttributes extends Optional<HouseholdMemberAttributes, 'id'> { }

class HouseholdMember extends Model<HouseholdMemberAttributes, HouseholdMemberCreationAttributes> implements HouseholdMemberAttributes {
    public id!: number;
    public householdId!: number;
    public userId!: number;
    public role!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

HouseholdMember.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        householdId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('owner', 'admin', 'member'),
            allowNull: false,
            defaultValue: 'member',
        },
    },
    {
        sequelize,
        tableName: 'household_members',
        modelName: 'HouseholdMember',
        timestamps: true
    }
);

export default HouseholdMember;