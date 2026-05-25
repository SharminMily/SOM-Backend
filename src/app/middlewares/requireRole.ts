import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.js';

const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new AppError(403, `Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  };
};

export default requireRole;