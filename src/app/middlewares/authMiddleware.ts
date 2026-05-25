import type { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError.js';
import { jwtHelpers } from '../helpers/jwtHelpers.js';
import config from '../config/index.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Authorization token is required');
  }

  const token = authHeader.split(' ')[1];

  const decoded = jwtHelpers.verifyToken(token, config.jwt.ACCESS_TOKEN_SECRET);

  req.user = decoded as any;

  next();
};

export default authMiddleware;