"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_js_1 = __importDefault(require("../errors/AppError.js"));
const jwtHelpers_js_1 = require("../helpers/jwtHelpers.js");
const index_js_1 = __importDefault(require("../config/index.js"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError_js_1.default(401, 'Authorization token is required');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwtHelpers_js_1.jwtHelpers.verifyToken(token, index_js_1.default.jwt.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map