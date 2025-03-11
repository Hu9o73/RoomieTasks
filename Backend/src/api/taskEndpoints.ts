import { Router, Request, Response } from 'express';
import { authenticate } from './AuthenticationControllers/authMiddleware';
import { Task, User, Household, HouseholdMember } from '../ConfigFiles/dbAssociations';
import { Op } from 'sequelize';

const router = Router();

// Check if user is a member of the household
const isMemberOfHousehold = async (userId: number, householdId: number): Promise<boolean> => {
    const membership = await HouseholdMember.findOne({
        where: {
            userId,
            householdId
        }
    });
    return !!membership;
};

// Create a new task
router.post('/tasks', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const { title, description, dueDate, priority, recurring, householdId, assignedTo } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!title || !dueDate || !householdId) {
            res.status(400).json({ error: 'Title, due date, and household ID are required' });
            return;
        }

        // Check if user is a member of the household
        if (!(await isMemberOfHousehold(userId, householdId))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Check if assignee is a member of the household
        if (assignedTo && !(await isMemberOfHousehold(assignedTo, householdId))) {
            res.status(400).json({ error: 'Assigned user is not a member of this household' });
            return;
        }

        // Create the task
        const task = await Task.create({
            title,
            description: description || '',
            dueDate,
            priority: priority || 'medium',
            status: 'pending',
            recurring: recurring || 'one-time',
            householdId,
            createdBy: userId,
            assignedTo: assignedTo || userId // Assign to self if no assignee specified
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks for a household
router.get('/households/:householdId/tasks', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const householdId = req.params.householdId;
        const userId = req.user.id;

        // Check if user is a member of the household
        if (!(await isMemberOfHousehold(userId, parseInt(householdId)))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Get tasks for the household
        const tasks = await Task.findAll({
            where: { householdId },
            include: [
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                }
            ],
            order: [['dueDate', 'ASC']]
        });

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get tasks assigned to the current user
router.get('/tasks/my-tasks', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const userId = req.user.id;

        // Get tasks assigned to the user
        const tasks = await Task.findAll({
            where: { assignedTo: userId },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                },
                {
                    model: Household,
                    as: 'household',
                    attributes: ['id', 'name']
                }
            ],
            order: [['dueDate', 'ASC']]
        });

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get a specific task
router.get('/tasks/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        // Get the task
        const task = await Task.findByPk(taskId, {
            include: [
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                },
                {
                    model: Household,
                    as: 'household',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Check if user is a member of the task's household
        if (!(await isMemberOfHousehold(userId, task.householdId))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        res.status(200).json({ task });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Update a task
router.put('/tasks/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, dueDate, priority, status, recurring, assignedTo } = req.body;

        // Get the task
        const task = await Task.findByPk(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Check if user is a member of the task's household
        if (!(await isMemberOfHousehold(userId, task.householdId))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Check if assignee is a member of the household (if being changed)
        if (assignedTo && assignedTo !== task.assignedTo && 
            !(await isMemberOfHousehold(assignedTo, task.householdId))) {
            res.status(400).json({ error: 'Assigned user is not a member of this household' });
            return;
        }

        // Update task fields if provided
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (priority) task.priority = priority;
        if (status) task.status = status;
        if (recurring) task.recurring = recurring;
        if (assignedTo) task.assignedTo = assignedTo;

        await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Mark a task as completed
router.patch('/tasks/:id/complete', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        // Get the task
        const task = await Task.findByPk(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Check if user is a member of the task's household
        if (!(await isMemberOfHousehold(userId, task.householdId))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Mark as completed
        task.status = 'completed';
        await task.save();

        // Handle recurring tasks - create next occurrence
        if (task.recurring !== 'one-time') {
            let nextDueDate = new Date(task.dueDate);
            
            if (task.recurring === 'daily') {
                nextDueDate.setDate(nextDueDate.getDate() + 1);
            } else if (task.recurring === 'weekly') {
                nextDueDate.setDate(nextDueDate.getDate() + 7);
            } else if (task.recurring === 'monthly') {
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            }
            
            // Create next occurrence
            await Task.create({
                title: task.title,
                description: task.description,
                dueDate: nextDueDate,
                priority: task.priority,
                status: 'pending',
                recurring: task.recurring,
                householdId: task.householdId,
                createdBy: task.createdBy,
                assignedTo: task.assignedTo
            });
        }

        res.status(200).json({
            message: 'Task marked as completed',
            task
        });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Failed to complete task' });
    }
});

// Delete a task
router.delete('/tasks/:id', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        // Get the task
        const task = await Task.findByPk(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Check if user is a member of the task's household
        if (!(await isMemberOfHousehold(userId, task.householdId))) {
            res.status(403).json({ error: 'You are not a member of this household' });
            return;
        }

        // Only creator or assigned user can delete a task
        if (task.createdBy !== userId && task.assignedTo !== userId) {
            res.status(403).json({ error: 'Only the creator or assigned user can delete this task' });
            return;
        }

        await task.destroy();

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Get upcoming tasks (due in the next 7 days)
router.get('/tasks/upcoming', authenticate, async (req: Request & { user?: any }, res: Response) => {
    try {
        const userId = req.user.id;
        
        // Calculate date range
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        // Find all households the user is a member of
        const memberships = await HouseholdMember.findAll({
            where: { userId },
            attributes: ['householdId']
        });
        
        const householdIds = memberships.map(m => m.get('householdId'));
        
        if (householdIds.length === 0) {
            res.status(200).json({ tasks: [] });
            return;
        }
        
        // Get upcoming tasks for these households
        const tasks = await Task.findAll({
            where: {
                householdId: { [Op.in]: householdIds },
                dueDate: { [Op.between]: [today, nextWeek] },
                status: 'pending'
            },
            include: [
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'firstName', 'lastName', 'nickname']
                },
                {
                    model: Household,
                    as: 'household',
                    attributes: ['id', 'name']
                }
            ],
            order: [['dueDate', 'ASC']]
        });
        
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming tasks' });
    }
});

export default router;