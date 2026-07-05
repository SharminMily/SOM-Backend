"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValidation = void 0;
const zod_1 = require("zod");
const createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ error: 'Title is required' }),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
const updateProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
        progress: zod_1.z.number().min(0).max(100).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
const addMemberSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid({ message: 'Valid userId is required' }),
        role: zod_1.z.enum(['LEAD', 'MEMBER', 'VIEWER']).optional(),
    }),
});
exports.projectValidation = { createProjectSchema, updateProjectSchema, addMemberSchema };
//# sourceMappingURL=projects.validation.js.map