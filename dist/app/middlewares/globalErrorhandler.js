"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_js_1 = __importDefault(require("../errors/handleZodError.js"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_js_1.default)(err);
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
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorhandler.js.map