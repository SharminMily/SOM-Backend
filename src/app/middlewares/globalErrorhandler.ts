import { ZodError } from "zod";
import config from "../config/index.js";
import type { TErrorSources } from "../globalTypes/error.type.js";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import handleZodError from "../errors/handleZodError.js";

const globalErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    err,
    // stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
