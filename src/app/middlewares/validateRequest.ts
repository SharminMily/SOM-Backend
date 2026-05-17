import type { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.js';
import type { AnyZodObject } from 'zod/v3';


const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;
