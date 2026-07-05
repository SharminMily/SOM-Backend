"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = handleZodError;
//# sourceMappingURL=handleZodError.js.map