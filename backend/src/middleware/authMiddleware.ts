import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1] as string;
      
      const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';
      
      const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { id: string; username: string };
      
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
