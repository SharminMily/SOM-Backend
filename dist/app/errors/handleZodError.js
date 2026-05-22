import { ZodError, } from 'zod';
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
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
//# sourceMappingURL=handleZodError.js.map