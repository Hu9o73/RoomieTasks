import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../ConfigFiles/dbAssociations';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
