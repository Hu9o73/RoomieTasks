import User from "../models/users";
import Task from "../models/tasks";
import Household from "../models/households";
import HouseholdMember from "../models/householdMembers";

// Define relationships
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

User.hasMany(Household, { foreignKey: 'ownerId', as: 'ownedHouseholds' });
Household.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Household.hasMany(Task, { foreignKey: 'householdId', as: 'tasks' });
Task.belongsTo(Household, { foreignKey: 'householdId', as: 'household' });

User.belongsToMany(Household, { through: HouseholdMember, foreignKey: 'userId', as: 'households' });
Household.belongsToMany(User, { through: HouseholdMember, foreignKey: 'householdId', as: 'members' });

export { User, Task, Household, HouseholdMember };