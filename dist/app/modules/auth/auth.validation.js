"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string('Email is required').email('Invalid email'),
        password: zod_1.z.string('Password is required').min(6, 'Password must be at least 6 characters'),
    }),
});
const forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string('Email is required').email('Invalid email'),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string('OTP is required'),
        newPassword: zod_1.z.string('New password is required').min(6, 'Password must be at least 6 characters'),
    }),
});
const changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string('Current password is required'),
        newPassword: zod_1.z.string('New password is required').min(6, 'Password must be at least 6 characters'),
    }),
});
exports.authValidation = {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
};
//# sourceMappingURL=auth.validation.js.map