import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import catchAsync from '../helpers/catchAsync.js';

const validateRequest = (schema: z.ZodTypeAny) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;