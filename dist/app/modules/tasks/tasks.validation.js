"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = void 0;
const zod_1 = require("zod");
const createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ error: 'Title is required' }),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        dueDate: zod_1.z.string().optional(),
        assignedToId: zod_1.z.string().uuid().optional(),
    }),
});
const updateTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        status: zod_1.z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
        dueDate: zod_1.z.string().optional(),
        assignedToId: zod_1.z.string().uuid().optional(),
    }),
});
const addCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({ error: 'Comment content is required' }).min(1),
    }),
});
exports.taskValidation = { createTaskSchema, updateTaskSchema, addCommentSchema };
//# sourceMappingURL=tasks.validation.js.map