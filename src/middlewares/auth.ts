import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    user: {
        id: string;
    };
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload['user'];
        }
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as UserPayload;

        // Add user from payload
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};