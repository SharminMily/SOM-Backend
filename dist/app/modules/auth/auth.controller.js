"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const auth_service_js_1 = require("./auth.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const http_status_2 = __importDefault(require("http-status"));
// login
const loginUser = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await auth_service_js_1.authService.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie('auth-token', result.accessToken, {
        // secure: config.node_env === 'production',
        secure: true,
        httpOnly: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_js_1.default)(res, {
        success: true,
        statusCode: http_status_2.default.OK,
        message: 'Logged in user successfully',
        data: {
            accessToken: result.accessToken,
        },
    });
});
// silent refresh
const refreshToken = (0, catchAsync_js_1.default)(async (req, res) => {
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie)
        throw new AppError_js_1.default(401, 'Refresh token not found');
    const result = await auth_service_js_1.authService.refreshAccessToken(refreshTokenCookie);
    res.cookie('auth-token', result.accessToken, {
        // secure: config.node_env === 'production',
        secure: true,
        httpOnly: true,
        sameSite: "none",
        path: '/',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken: result.accessToken, user: result.user },
    });
});
// logout
const logoutUser = (0, catchAsync_js_1.default)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new AppError_js_1.default(401, 'Already logged out');
    }
    await auth_service_js_1.authService.logoutUser(refreshToken);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged out successfully',
        data: null,
    });
});
// verify email
const verifyEmail = (0, catchAsync_js_1.default)(async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        throw new AppError_js_1.default(400, 'Verification token is required');
    }
    await auth_service_js_1.authService.verifyEmail(token);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Email verified successfully',
        data: null,
    });
});
// forgot password
const forgotPassword = (0, catchAsync_js_1.default)(async (req, res) => {
    await auth_service_js_1.authService.forgotPassword(req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent to your email',
        data: null,
    });
});
// reset password
const resetPassword = (0, catchAsync_js_1.default)(async (req, res) => {
    await auth_service_js_1.authService.resetPassword(req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset successfully',
        data: null,
    });
});
// change password
const changePassword = (0, catchAsync_js_1.default)(async (req, res) => {
    const userId = req.user?.id;
    await auth_service_js_1.authService.changePassword(userId, req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password changed successfully',
        data: null,
    });
});
// get current user
const getCurrentUser = (0, catchAsync_js_1.default)(async (req, res) => {
    const userId = req.user?.id;
    // console.log('Current user ID:', userId);
    if (!userId) {
        throw new AppError_js_1.default(401, 'User not authenticated');
    }
    const result = await auth_service_js_1.authService.getCurrentUser(userId);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_2.default.OK,
        success: true,
        message: 'Current user retrieved successfully',
        data: result,
    });
});
exports.authController = {
    loginUser,
    refreshToken,
    logoutUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentUser
};
//# sourceMappingURL=auth.controller.js.map