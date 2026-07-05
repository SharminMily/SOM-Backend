"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_js_1 = __importDefault(require("../errors/AppError.js"));
const requireRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            throw new AppError_js_1.default(403, `Access denied. Required roles: ${roles.join(', ')}`);
        }
        next();
    };
};
exports.default = requireRole;
//# sourceMappingURL=requireRole.js.map