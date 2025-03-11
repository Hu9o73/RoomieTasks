import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../ConfigFiles/dbAssociations';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, confirmPassword, year, program, school } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            year,
            program,
            school,
        });

        res.status(201).json({ message: 'User created successfully', user: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};