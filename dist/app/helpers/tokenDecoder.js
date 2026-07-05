"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDecoder = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_js_1 = __importDefault(require("../errors/AppError.js"));
const jwtHelpers_js_1 = require("./jwtHelpers.js");
const process_1 = require("process");
const tokenDecoder = (req) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, 'You Are Not Authorized');
    }
    const decoded = jwtHelpers_js_1.jwtHelpers.verifyToken(token, process_1.config.jwt.REFRESH_TOKEN_SECRET);
    return decoded;
};
exports.tokenDecoder = tokenDecoder;
//# sourceMappingURL=tokenDecoder.js.map