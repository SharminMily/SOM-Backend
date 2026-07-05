"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../../shared/prisma.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const jwtHelpers_js_1 = require("../../helpers/jwtHelpers.js");
const index_js_1 = __importDefault(require("../../config/index.js"));
const auth_interface_js_1 = require("./auth.interface.js");
const sendEmail_js_1 = require("../../helpers/sendEmail.js");
// login
const loginUser = async (data) => {
    const userData = await prisma_js_1.prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!userData) {
        throw new AppError_js_1.default(404, 'User not found!');
    }
    if (userData.status === 'SUSPENDED') {
        throw new AppError_js_1.default(403, 'Your account is suspended');
    }
    const isCorrectPassword = await bcrypt_1.default.compare(data.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_js_1.default(403, 'You have given a wrong password!');
    }
    // token payload
    const tokenPayload = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: userData.status,
        avatarUrl: userData.avatarUrl,
    };
    // access token
    const accessToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.ACCESS_TOKEN_SECRET, index_js_1.default.jwt.ACCESS_TOKEN_EXPIRES_IN);
    // refresh token
    const refreshToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.REFRESH_TOKEN_SECRET, index_js_1.default.jwt.REFRESH_TOKEN_EXPIRES_IN);
    await prisma_js_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: userData.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
    };
};
// silent refresh
const refreshAccessToken = async (refreshToken) => {
    // verify token is valid
    const decoded = jwtHelpers_js_1.jwtHelpers.verifyToken(refreshToken, index_js_1.default.jwt.REFRESH_TOKEN_SECRET);
    // check token exists in db and not blacklisted
    const storedToken = await prisma_js_1.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });
    if (!storedToken || storedToken.blacklisted) {
        throw new AppError_js_1.default(403, 'Invalid or expired refresh token');
    }
    if (storedToken.expiresAt < new Date()) {
        throw new AppError_js_1.default(403, 'Refresh token expired');
    }
    if (storedToken.user.status === 'SUSPENDED') {
        throw new AppError_js_1.default(403, 'Your account is suspended');
    }
    const tokenPayload = (0, auth_interface_js_1.buildTokenPayload)(storedToken.user);
    // token rotation — blacklist old, issue new
    const newRefreshToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.REFRESH_TOKEN_SECRET, index_js_1.default.jwt.REFRESH_TOKEN_EXPIRES_IN);
    const newAccessToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.ACCESS_TOKEN_SECRET, index_js_1.default.jwt.ACCESS_TOKEN_EXPIRES_IN);
    // blacklist old refresh token
    await prisma_js_1.prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { blacklisted: true },
    });
    // store new refresh token
    await prisma_js_1.prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: storedToken.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return { accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
            id: storedToken.user.id,
            email: storedToken.user.email,
            firstName: storedToken.user.firstName,
            lastName: storedToken.user.lastName,
            role: storedToken.user.role,
            status: storedToken.user.status,
            avatarUrl: storedToken.user.avatarUrl,
        },
    };
};
// logout
const logoutUser = async (refreshToken) => {
    const storedToken = await prisma_js_1.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
    if (!storedToken) {
        throw new AppError_js_1.default(404, 'Token not found');
    }
    // blacklist the token
    await prisma_js_1.prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { blacklisted: true },
    });
};
// verify email
const verifyEmail = async (token) => {
    const user = await prisma_js_1.prisma.user.findFirst({
        where: {
            emailVerifyToken: token,
            emailVerifyExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new AppError_js_1.default(400, 'Invalid or expired verification token');
    }
    await prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            emailVerifyToken: null,
            emailVerifyExpires: null,
        },
    });
};
// forgot password — send OTP email
const forgotPassword = async (payload) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new AppError_js_1.default(404, 'No account found with this email');
    }
    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetOtp: otp,
            passwordResetExpires: otpExpires,
        },
    });
    await (0, sendEmail_js_1.sendEmail)({
        to: user.email,
        subject: 'Password Reset OTP',
        html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP expires in 15 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
    });
};
// reset password with OTP
const resetPassword = async (payload) => {
    const user = await prisma_js_1.prisma.user.findFirst({
        where: {
            passwordResetOtp: payload.token,
            passwordResetExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new AppError_js_1.default(400, 'Invalid or expired OTP');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetOtp: null,
            passwordResetExpires: null,
        },
    });
};
// change password (logged in user)
const changePassword = async (userId, payload) => {
    const user = await prisma_js_1.prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });
    const isMatch = await bcrypt_1.default.compare(payload.currentPassword, user.password);
    if (!isMatch) {
        throw new AppError_js_1.default(401, 'Current password is incorrect');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_js_1.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
};
const getCurrentUser = async (userId) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            avatarUrl: true,
            departmentId: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // console.log('Fetched user from DB:', user);
    if (!user) {
        throw new AppError_js_1.default(404, 'User not found');
    }
    if (user.status === 'SUSPENDED') {
        throw new AppError_js_1.default(403, 'Your account is suspended');
    }
    return user;
};
exports.authService = {
    loginUser,
    refreshAccessToken,
    logoutUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentUser
};
//# sourceMappingURL=auth.service.js.map