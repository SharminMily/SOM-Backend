import { ZodError, type ZodIssue,  } from 'zod';
import type { TErrorSources, TGenericErrorResponse } from '../globalTypes/error.type.js';



const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => ({
    path: String(issue.path[issue.path.length - 1]),
    message: issue.message,
  }));

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error, check input field',
    errorSources,
  };
};

export default handleZodError;