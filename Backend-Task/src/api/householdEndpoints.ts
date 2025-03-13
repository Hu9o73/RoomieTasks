import { Router, Request, Response } from 'express';
import { authenticate } from './AuthenticationControllers/authMiddleware';
import { Household, HouseholdMember, User } from '../ConfigFiles/dbAssociations';
import { v4 as uuidv4 } from 'uuid';
import { getUsersInfo } from '../services/userService';

const router = Router();

// Create a new household
// Find the household creation route and modify it:
router.post('/households', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            res.status(400).json({ error: 'Household name is required' });
            return;
        }

        // Generate a unique invite code
        const inviteCode = uuidv4().substring(0, 8);

        // In the task-service, we need to check if the user already exists in our local users table
        let user = await User.findByPk(userId);
        
        // If user doesn't exist in the task database, create a lightweight copy
        if (!user) {
            user = await User.create({
                id: userId, // Use the same ID from auth service
                firstName: req.user.firstName || 'User',
                lastName: req.user.lastName || String(userId),
                email: req.user.email || `user${userId}@example.com`,
                password: 'not-used-password',  // This is just a reference table
                nickname: '',
                year: '',
                program: '',
                school: '',
                role: req.user.role || 'member'
            });
        }

        // Create the household
        const household = await Household.create({
            name,
            inviteCode,
            ownerId: userId
        });

        // Add the creator as a member with owner role
        await HouseholdMember.create({
            householdId: household.id,
            userId: userId,
            role: 'owner'
        });

        res.status(201).json({ 
            message: 'Household created successfully', 
            household: {
                id: household.id,
                name: household.name,
                inviteCode: household.inviteCode
            }
        });
    } catch (error) {
        console.error('Error creating household:', error);
        res.status(500).json({ error: 'Failed to create household' });
    }
});

// Get all households for the authenticated user
router.get('/households', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const userId = req.user.id;

        // Find all household memberships for the user
        const memberships = await HouseholdMember.findAll({
            where: { userId },
            include: [{
                model: Household,
                as: 'household'
            }]
        });

        // Extract household data
        const households = memberships.map(membership => {
            const household = membership.get('household') as Household;
            return household;
        });

        res.status(200).json({ households });
    } catch (error) {
        console.error('Error fetching households:', error);
        res.status(500).json({ error: 'Failed to fetch households' });
    }
});

// Get a specific household
router.get('/households/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.id;
        const userId = req.user.id;

        // Get household details first
        const household = await Household.findByPk(householdId);
        
        if (!household) {
            res.status(404).json({ error: 'Household not found' });
            return;
        }

        // Check if user is a member of the household
        const membership = await HouseholdMember.findOne({
            where: { 
                householdId,
                userId 
            }
        });

        if (!membership) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Get member IDs
        const members = await HouseholdMember.findAll({
            where: { householdId }
        });
        
        const userIds = members.map(member => member.userId);
        
        // Fetch user details from user service
        const token = req.header('Authorization') || '';
        const users = await getUsersInfo(userIds, token);
        
        // Map member data with user info
        const memberData = members.map(member => {
            const user = users.find((u: any) => u.id === member.userId) || { 
                id: member.userId,
                firstName: `User`,
                lastName: `${member.userId}`,
                email: '',
                nickname: '' 
            };
            
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                nickname: user.nickname,
                role: member.role
            };
        });
        
        res.status(200).json({ 
            household,
            members: memberData
        });
    } catch (error) {
        console.error('Error fetching household:', error);
        res.status(500).json({ 
            error: 'Failed to fetch household details',
        });
    }
});

// Join a household using invite code
router.post('/households/join', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user.id;

        if (!inviteCode) {
            res.status(400).json({ error: 'Invite code is required' });
            return;
        }

        // Find the household with the invite code
        const household = await Household.findOne({
            where: { inviteCode }
        });

        if (!household) {
            res.status(404).json({ error: 'Invalid invite code' });
            return;
        }

        // Check if user already exists in task service database
        let user = await User.findByPk(userId);
        
        // If user doesn't exist in the task database, create a lightweight copy
        if (!user) {
            user = await User.create({
                id: userId,
                firstName: req.user.firstName || 'User',
                lastName: req.user.lastName || String(userId),
                email: req.user.email || `user${userId}@example.com`,
                password: 'not-used-password',
                nickname: '',
                year: '',
                program: '',
                school: '',
                role: req.user.role || 'member'
            });
        }

        // Check if user is already a member
        const existingMembership = await HouseholdMember.findOne({
            where: {
                householdId: household.id,
                userId
            }
        });

        if (existingMembership) {
            res.status(400).json({ error: 'You are already a member of this household' });
            return;
        }

        // Add user as a member
        await HouseholdMember.create({
            householdId: household.id,
            userId,
            role: 'member'
        });

        res.status(200).json({ 
            message: 'Successfully joined household',
            household: {
                id: household.id,
                name: household.name
            }
        });
    } catch (error) {
        console.error('Error joining household:', error);
        res.status(500).json({ error: 'Failed to join household' });
    }
});

// Leave a household
router.delete('/households/:id/leave', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.id;
        const userId = req.user.id;

        // Find the membership
        const membership = await HouseholdMember.findOne({
            where: {
                householdId,
                userId
            }
        });

        if (!membership) {
            res.status(404).json({ error: 'You are not a member of this household' });
            return;
        }

        // Check if user is the owner
        const household = await Household.findByPk(householdId);
        if (household && household.ownerId === userId) {
            res.status(400).json({ error: 'The owner cannot leave the household. Transfer ownership first or delete the household.' });
            return;
        }

        // Remove membership
        await membership.destroy();

        res.status(200).json({ message: 'Successfully left the household' });
    } catch (error) {
        console.error('Error leaving household:', error);
        res.status(500).json({ error: 'Failed to leave household' });
    }
});

// Update household details
router.put('/households/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.id;
        const userId = req.user.id;
        const { name } = req.body;

        // Check if user is the owner
        const household = await Household.findByPk(householdId);
        if (!household) {
            res.status(404).json({ error: 'Household not found' });
            return;
        }

        if (household.ownerId !== userId) {
            res.status(403).json({ error: 'Only the owner can update household details' });
            return;
        }

        // Update household
        if (name) {
            household.name = name;
            await household.save();
        }

        res.status(200).json({
            message: 'Household updated successfully',
            household: {
                id: household.id,
                name: household.name,
                inviteCode: household.inviteCode
            }
        });
    } catch (error) {
        console.error('Error updating household:', error);
        res.status(500).json({ error: 'Failed to update household' });
    }
});

// Generate a new invite code
router.post('/households/:id/newInviteCode', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.id;
        const userId = req.user.id;

        // Check if user is the owner
        const household = await Household.findByPk(householdId);
        if (!household) {
            res.status(404).json({ error: 'Household not found' });
            return;
        }

        if (household.ownerId !== userId) {
            res.status(403).json({ error: 'Only the owner can generate a new invite code' });
            return;
        }

        // Generate new invite code
        const newInviteCode = uuidv4().substring(0, 8);
        household.inviteCode = newInviteCode;
        await household.save();

        res.status(200).json({
            message: 'New invite code generated',
            inviteCode: newInviteCode
        });
    } catch (error) {
        console.error('Error generating new invite code:', error);
        res.status(500).json({ error: 'Failed to generate new invite code' });
    }
});

// Delete a household
router.delete('/households/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.id;
        const userId = req.user.id;

        // Check if user is the owner
        const household = await Household.findByPk(householdId);
        if (!household) {
            res.status(404).json({ error: 'Household not found' });
            return;
        }

        if (household.ownerId !== userId) {
            res.status(403).json({ error: 'Only the owner can delete the household' });
            return;
        }

        // Delete all memberships
        await HouseholdMember.destroy({
            where: { householdId }
        });

        // Delete the household
        await household.destroy();

        res.status(200).json({ message: 'Household deleted successfully' });
    } catch (error) {
        console.error('Error deleting household:', error);
        res.status(500).json({ error: 'Failed to delete household' });
    }
});

export default router;