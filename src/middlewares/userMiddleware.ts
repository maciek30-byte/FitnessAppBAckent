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
  // Pobierz token z nagłówka
  const token = req.header('x-auth-token');

  // Sprawdź czy token istnieje
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Weryfikuj token
    const decoded = jwt.verify(token, 'your_jwt_secret') as UserPayload;

    // Dodaj dane użytkownika do obiektu request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
