import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

require('dotenv').config();

// Get the secret Key from the .env file
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

// Middleware to verify JWT token
export const authenticate = (req: Request & { user?: any }, res: Response, next: NextFunction) => {

  // Extract token from the request header parameter 'Authorization'
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).send({ message: 'No token provided.' });
    return
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };

    // Attach the user info to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token.' });
    return
  }
};


// Middleware to verify roles
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ error: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  }
}

export default authenticate;