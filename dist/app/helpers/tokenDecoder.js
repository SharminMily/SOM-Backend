/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, {} from 'jsonwebtoken';
import status from 'http-status';
import AppError from '../errors/AppError.js';
import { jwtHelpers } from './jwtHelpers.js';
import { config } from 'process';
export const tokenDecoder = (req) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        throw new AppError(status.UNAUTHORIZED, 'You Are Not Authorized');
    }
    const decoded = jwtHelpers.verifyToken(token, config.jwt.REFRESH_TOKEN_SECRET);
    return decoded;
};
//# sourceMappingURL=tokenDecoder.js.map