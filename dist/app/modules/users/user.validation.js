"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
// src/modules/user/user.validation.ts
const zod_1 = require("zod");
const enums_js_1 = require("../../constants/enums.js");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    phone: zod_1.z.string().regex(/^\+?[0-9\s-]{8,15}$/).optional(),
    departmentId: zod_1.z.string().uuid().optional(),
    managerId: zod_1.z.string().uuid().optional(),
    role: zod_1.z.nativeEnum(enums_js_1.Role).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    departmentId: zod_1.z.string().uuid().optional(),
    managerId: zod_1.z.string().uuid().optional(),
    role: zod_1.z.nativeEnum(enums_js_1.Role).optional(),
    status: zod_1.z.nativeEnum(enums_js_1.UserStatus).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid user ID'),
});
//# sourceMappingURL=user.validation.js.map