import { ZodError } from "zod";
import config from "../config/index.js";
import handleZodError from "../errors/handleZodError.js";
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorSources = [
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
//# sourceMappingURL=globalErrorhandler.js.map