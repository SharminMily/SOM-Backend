import status from 'http-status';
import jwt, {} from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
const createToken = (payload, secret, expiresIn) => {
    if (!secret || typeof secret !== 'string') {
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'JWT Secret is missing or invalid');
    }
    if (!expiresIn ||
        (typeof expiresIn !== 'string' && typeof expiresIn !== 'number')) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'JWT Expiry is invalid');
    }
    const signOptions = {
        expiresIn: expiresIn,
        algorithm: 'HS256',
    };
    try {
        return jwt.sign(payload, secret, signOptions);
    }
    catch (error) {
        console.error('Error creating token:', error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create JWT');
    }
};
// Verify token
const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded.id) {
            throw new AppError(status.FORBIDDEN, 'Token missing essential fields');
        }
        return decoded;
    }
    catch (error) {
        const err = error;
        console.error('Token verification error:', err);
        if (err.name === 'JsonWebTokenError') {
            throw new AppError(status.FORBIDDEN, 'Invalid token signature');
        }
        else if (err.name === 'TokenExpiredError') {
            throw new AppError(status.FORBIDDEN, 'Token expired');
        }
        throw new AppError(status.FORBIDDEN, 'Forbidden');
    }
};
export const jwtHelpers = {
    createToken,
    verifyToken,
};
//# sourceMappingURL=jwtHelpers.js.map